// Importando os hooks useEffect e useState. Por definição, um Hook é um componente que te permite utilizar 
// recursos do React
import { useEffect, useState, BackHandler } from 'react';

// Importando os componentes utilizados nessa página
import { ActivityIndicator, FlatList, StatusBar, Text, View, TouchableOpacity} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';

// Importando a função que descreve como foi definida a navegação da aplicação
import { useNavigation } from '@react-navigation/native';

// Lodash (acessado usando-se o underscore) nos dá uma série de funções utilitárias para manipulação
// de: Array,Collection, Date, Function, String, entre outras classes.
import _ from 'lodash';

import  estilo  from './Estilo';

import  firebase from '../firebase/config';

function Alunos() {
  // Recuperando o componente de navegação da aplicação
  const navigation = useNavigation();
  // O hook 'useState' define um componente Wrapper com o atributo interno 'state'. Ele nos traz uma 
  // série de vantagens: (1) a referência para o componente é 'const', mas o estado interno do objeto é 
  // mutável através do uso da função associada na declaração. 
  // (2) Se o componente é utilizado em algum ponto da página e se ele troca o seu 'state', automaticamente
  // as partes que a página referenciam o componente (observadores) são alteradas, funcionando como 
  // se fosse uma callback. 
  const [carregarPagina, setCarregarPagina] = useState(true);
  // Hook para colocar o ícone animado de carga na página (quando se busca os dados de aluno com fetch)
  const [carregandoDados, setCarregandoDados] = useState(false);
  // Hook para guardar as alunos a serem apresentadas. 
  const [alunos, setAlunos] = useState([]);
  
  // Colunas sendo utilizadas na  FlatList (tabela)
  const  colunas  = [
    {nome:" ",tam:'7%'},
    {nome:"cpf",tam:'30%'},
    {nome:"nome",tam:'33%'},
    {nome:"matr",tam:'15%'},
    {nome:"curso",tam:'15%'} ];
  // Hook para indicar qual é o sentido de ordenação a ser empregado
  const [ direcao, setDirecao ] = useState('desc');
  // Hook para indicar qual é a coluna selecionada como padrão de ordenação
  const [ colunaSelecionada, setColunaSelecionada ] = useState("matr");
  // Hook para indicar qual é o registro que está selecionado
  const [ regSelecionado, setRegSelecionado ] = useState(null);

  const dbRef = firebase.database().ref();

  //-------------------------------------------------------------------------
  // useEffect: esse hook é disparado toda vez que este componente (Alunos) for renderizado. 
  // A função de efeito (1o parâmetro)  é executada toda vez que as dependências (2o parâmetro) 
  // mudarem de estado
  //------------------------------------------------------------------------
  useEffect(() => {   // 1o parâmetro: função de efeito
    // carregando os alunos
    obterAlunos();
    // Definindo a callback do evento focus na navegação
    navigation.addListener('focus', () => setCarregarPagina(!carregarPagina));
  }, 
   // 2o Parâmetro: Dependências 
   // Se for um array vazio, ele executa somente uma vez quando o componente for renderizado
   // Se for um array preenchido, a cada vez que as variáveis presentes no array forem alteradas, 
   // então a função de efeito será executada
  [carregarPagina]); 


  //-------------------------------------------------------------------------
  // ObterAlunos: função para efetuar a carga dos alunos através do servidor
  //-------------------------------------------------------------------------
  const obterAlunos = () => {
    try {
      // Coloco o ícone animado de ação de carga
      setCarregandoDados(true);
      dbRef.child("alunos").get().then((snapshot) => {
        let lstAlunos = [];
        const data = snapshot.val();
        for (const [matricula, umAluno] of Object.entries(data)) {
          console.log(`${matricula}: ${umAluno}`);
          lstAlunos.push(umAluno);
        }
        // Atualizo a lista de alunos
        setAlunos(lstAlunos);
      });
    } catch (error) {
      console.log("#### ", error);
    } finally {
      // Retiro o ícone animado de ação de carga
      setCarregandoDados(false);
    }
  }     

  //------------------------------------------------------------------------
  // ExcluirAluno: função para efetuar a exclusão do registro selecionado 
  //------------------------------------------------------------------------
  const excluirAluno = async () => {
     try {
      // Se nenhum registro foi selecionado, sai da função
      if(regSelecionado == null) {
        alert("Nenhum item selecionado para exclusão");
        return;
      }
      setCarregandoDados(true);
      let ref = dbRef.child("alunos").child(regSelecionado);
      ref.remove((error) => {
        if (error) {
          console.log("Excluir - " + error);
        } else {    
            console.log("Excluir Ok");
        }
        obterAlunos();
        setRegSelecionado(null);
        setAlunos(lstAlunos);
        });
      // Realizo novamente a carga de alunos
      // Desmarco todos os radio buttons
    } catch (error) {
      console.error("ERRO: " + error);
    } finally {
       // Retiro o ícone animado de ação de carga
     setCarregandoDados(true);
    }
  }

  //----------------------------------------------------------------
  // SortTable: função chamada para efetuar a ordenação na FlatList
  //----------------------------------------------------------------
  const sortTable = (coluna) => {
    // Vejo qual é o valor que está no Hook de direção para saber o sentido da ordenação
    const novaDirecao = direcao === "desc" ? "asc" : "desc";
    // Utilizando a função orderBy da LoDash
    const sortedData = _.orderBy(alunos, coluna, novaDirecao);
    // Determino qual é a coluna selecionada
    setColunaSelecionada(coluna);    
    // Determino qual é a direção que foi empregada 
    setDirecao(novaDirecao);
    // Atualizo a lista de alunos, agora ordenada
    setAlunos(sortedData);
  }

  //-------------------------------------------------------------
  // tableHeader
  //-------------------------------------------------------------
  const tableHeader = () => (
    <View style={estilo.tableHeader}>
      {
        colunas.map((coluna, index) => {
          {
            { /*** TouchableOpacity define uma área sensível ao toque e que fica opaca durante o toque ***/ }
            return ( // o ... se refere ao operador 'spread' usado para copiar as propriedades presentes dentro de ...estilo.columnHeader.
              <TouchableOpacity key={index} style={{...estilo.columnHeader,width:coluna.tam}} onPress={()=> sortTable(coluna.nome)}>
                <Text style={estilo.columnHeaderTxt}> 
                  {coluna.nome + " "} 
                  {colunaSelecionada === coluna.nome && 
                    <MaterialCommunityIcons name={direcao === "desc" ? "arrow-down-drop-circle" : "arrow-up-drop-circle"} />
                  }
                </Text>
              </TouchableOpacity>
            )
          }
        })
      }
    </View>
  );

//-------------------------------------------------------------
// RETORNO DA PÁGINA
//-------------------------------------------------------------
return (
    <View style={estilo.container}>
      <FlatList 
        data={alunos} 
        style={estilo.flatlist} 
        keyExtractor={(item, index) => index+""}
        ListHeaderComponent={tableHeader}
        stickyHeaderIndices={[0]}
        renderItem={({item, index})=> {
            console.log("* ", item);
            return (
              <View style={index % 2 == 1 ? estilo.tableRowBlue : estilo.tableRowWhite}>
                <RadioButton style={{...estilo.columnRowTxt,width:'7%'}} value={item.matricula}
                  status={ regSelecionado === item.matricula ? 'checked' : 'unchecked' }
                  onPress={(value) => {setRegSelecionado(item.matricula)}} />
                <Text style={{...estilo.columnRowTxt,width:'30%'}}>{item.cpf}</Text>
                <Text style={{...estilo.columnRowTxt,width:'33%'}}>{item.nome}</Text>
                <Text style={{...estilo.columnRowTxt,width:'15%'}}>{item.matricula}</Text>
                <Text style={{...estilo.columnRowTxt,width:'15%'}}>{item.curso}</Text>
              </View>
            )
        }}
      />
      <Text style={estilo.tableBottom}></Text>
      {carregandoDados ? <ActivityIndicator/> : ""}
      <StatusBar style={estilo.tableBottom}/>
      { /**** navigation.navigate executa uma navegação para a página com o nome indicado. ****/ }
      { /**** o segundo parâmetro são dados a serem repassados à página ****/ }
      <TouchableOpacity
        style={estilo.button}
        onPress={() => {navigation.navigate('FormDeAluno',{operacao:'incluir'});} }>
        <Text style={estilo.buttonText}>Incluir</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={estilo.button}
        onPress={() => {
          if(regSelecionado == null)
            alert("Nenhum item selecionado para alteração");
          else
            /****  Observe a configuração do objeto 'params' contendo a indicação da operação e id ****/
            /**** do registro selecionado ****/
            navigation.navigate('FormDeAluno',{operacao:'alterar',matricula: regSelecionado})}}>
      <Text style={estilo.buttonText}>Alterar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={estilo.button}
        onPress={() => excluirAluno() }>
        <Text style={estilo.buttonText}>Excluir</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={estilo.button}
        onPress={() => BackHandler.exitApp() }>
        <Text style={estilo.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
export default Alunos;

