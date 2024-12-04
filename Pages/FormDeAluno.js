import { useEffect, useState } from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator} from 'react-native';
import Picker from 'react-native-picker-select';
// Importando um componente gerado nesse projeto. Não é necessário acrescentar o .js na indicação do arquivo
import MeuCompHeader from '../components/MeuCompHeader';
import logo from '../assets/logo.png';
import estilo from './Estilo';
import  firebase from '../firebase/config';

function FormDeAluno({ navigation, route }) {
  // route.params é um map que dá todos os dados repassados pela página que efetuou a chamada
  const [operacao] = useState(route.params.operacao);

  const [matricula, setMatricula] = useState(operacao !== 'incluir'? route.params.matricula : '');
  const [cpf, setCpf] = useState(operacao !== 'incluir'? route.params.cpf : '');
  const [nome, setNome] = useState(operacao !== 'incluir'? route.params.nome : ''); 
  const [curso, setCurso] = useState(operacao !== 'incluir'? route.params.curso : '');
  const [listaCursos, setListaCursos] = useState([]);

  const [carregandoDados, setCarregandoDados] = useState(false);
  
  const placeholder = {
    label: 'Selecione o curso:',
    value: null,
    color: 'darkgray',
  };

  const dbRef = firebase.database().ref();

  //-------------------------------------------------------------
  // obterCursos
  //-------------------------------------------------------------
  
  const obterCursos = async () => {
    try {
      // Coloco o ícone animado de ação de carga
      setCarregandoDados(true);
      dbRef.child("cursos").get().then((snapshot) => {
        let lstCursos = [];
        if(snapshot.exists()) {
          const data = snapshot.val();
          for (const [sigla, curso] of Object.entries(data)) {
            console.log(`${sigla}: ${curso}`);
            lstCursos.push({'label': curso.nome, 'value': curso.sigla});
          }          
          // Atualizo a lista de cursos
          setListaCursos(lstCursos);
          console.log(cursos);
        }
      });
    } catch (error) {
      console.log("#### ", error);
    } finally {
      // Retiro o ícone animado de ação de carga
      setCarregandoDados(false);
    }
  }     
     
  //-------------------------------------------------------------
  // obterAluno
  //-------------------------------------------------------------
  
const obterAluno = async (matricula) => {
  dbRef.child("alunos").child(matricula).get().then((snapshot) => {
    if(snapshot.exists()) {
      let aluno = snapshot.val(); 
      setMatricula(aluno.matricula);
      setCpf(aluno.cpf);
      setNome(aluno.nome);
      setCurso(aluno.curso);
      placeholder.value = aluno.curso;
    }
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("#------->" + errorMessage + " " + errorCode);
  }); 
}

//-------------------------------------------------------------
// incluirAluno
//-------------------------------------------------------------
  
const incluirAluno = async () => {
  console.log(curso)
  console.log(matricula)
  console.log(nome)
  console.log(cpf)

  let novoAluno = {
    "cpf" : cpf,
    "matricula" : matricula,
    "nome" : nome,
    "curso" : curso
    };

  try {
    setCarregandoDados(true);
    console.log(novoAluno, operacao)
    let ref = dbRef.child("alunos").child(matricula);
    ref.set(novoAluno, (error) => {
      if (error) {
        console.log("Incluir - " + error);
      } else {    
        console.log("Incluir Ok");
      }
    });
    navigation.goBack();
  } catch (error) {
    console.log("erro:" + error);
  } finally {
    setCarregandoDados(false);
  }
}

//-------------------------------------------------------------
// alterarAluno
//-------------------------------------------------------------
  
  const alterarAluno = async () => {
  let aluno = {
    "cpf" : cpf,
    "matricula" : matricula,
    "nome" : nome,
    "curso" : curso
    };

  try {
    setCarregandoDados(true);
    let ref = dbRef.child("alunos").child(matricula);
    ref.set(aluno, (error) => {
      if (error) {
        console.log("Incluir - " + error);
      } else {    
        console.log("Incluir Ok");
      }
    });
    navigation.goBack();
  } catch (error) {
    console.log("erro:" + error);
  } finally {
    setCarregandoDados(false);
  }
}

//--------------------------------------------------------------------------------
// useEffect: quando o form acabar sua 'renderização', o useEffect será disparado
//--------------------------------------------------------------------------------
  useEffect(() => {
    console.log("UseEffect");
    obterCursos();
    if(operacao === 'alterar')
      obterAluno(matricula);
  }, [navigation]);

  // Tratamento dos eventos de alteração do formulário
  function evtMatriculaAlterada(i) {
    setMatricula(i);
  }
  function evtCpfAlterado(i) {
    setCpf(i);
  }
  function evtNomeAlterado(n) {
    setNome(n);
  }
  function evtCursoAlterado(c) {
    setCurso(c);
  }
  function voltar() {
    navigation.goBack();
  }

//-------------------------------------------------------------
// Retorno da Página
//-------------------------------------------------------------

  return (
    <>
      <MeuCompHeader title="Cadastro de Alunos" />
      <View style={estilo.container}>
        <Image source={logo} style={estilo.topImage} />
        <Text style={estilo.title}>Formulário</Text>
        <TextInput
          name="matr"
          style={estilo.input}
          placeholder="Matrícula:"
          keyboardType={'numeric'}
          onChangeText={evtMatriculaAlterada}
          editable = {operacao === 'incluir'}
          value={matricula}
        />
        <TextInput
          name="cpf"
          style={estilo.input}
          placeholder="Cpf:"
          onChangeText={evtCpfAlterado}
          value={cpf}
        />
        <TextInput
          name="nome"
          style={estilo.input}
          placeholder="Nome:"
          onChangeText={evtNomeAlterado}
          value={nome}
        />
        <Picker
          name="curso"
          selectedValue={curso}
          placeholder={placeholder}
          onValueChange={evtCursoAlterado}
          style={pickerSelectStyles}
          items={listaCursos}
        />
        <TouchableOpacity style={estilo.button} onPress={operacao === 'incluir' ? incluirAluno : alterarAluno}>
          <Text style={estilo.buttonText}> Salvar </Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilo.button} onPress={voltar}>
          <Text style={estilo.buttonText}>Cancelar</Text>
        </TouchableOpacity>
       {carregandoDados ? <ActivityIndicator/> : ""}
     </View>
    </>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    fontSize: 16,
    padding: 5,
    alignItems: 'stretch',
    alignSelf: 'center',
    width: 300
  },
  inputAndroid: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    fontSize: 16,
    padding: 5,
    alignItems: 'stretch',
    alignSelf: 'center',
    width: 300
  },
});

export default FormDeAluno;
