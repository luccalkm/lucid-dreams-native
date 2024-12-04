import { useState } from 'react';
// Importando a função que descreve como foi definida a navegação da aplicação
import { useNavigation } from '@react-navigation/native';
import { View, Alert, Text, TextInput, Button, Modal, Pressable, StyleSheet } from 'react-native';
import firebase from '../firebase/config';

function CriarConta() {
  // Recuperando o componente de navegação da aplicação
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisivel, setModalVisivel] = useState(false);

  const login = () => {
    navigation.navigate('Auth');
  }

  const criarConta = async () => {
    console.log("criarConta");
    let app = firebase.auth();
    //
    // PARA CRIAR CONTA DE ACESSO NO SISTEMA (obter um user.uid)
    //
    app.createUserWithEmailAndPassword(username.toString(), password.toString())
      .then(async (userCred) => {
        // Signed in
        var user = userCred.user;
        //Send email verification link
        await user.sendEmailVerification()        
        setModalVisivel(true);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("$$------>" + errorMessage);
      });
  };

  return (
    <View>
      <Text style={styles.negrito}>Email:</Text>
      <TextInput
        placeholder="Preencha o email"
        value={username}
        onChangeText={setUsername}
      />
      <Text> </Text>
      <Text style={styles.negrito}>Senha:</Text>
      <TextInput
        placeholder="Preencha a senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text> </Text>
      <Button
        title="Criar Conta"
        onPress={() => criarConta()}
      />
      <Text> </Text>
      <Button
        title="Login"
        onPress={() => login()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => {
          setModalVisivel(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Solicitação de criação de conta solicitada. Veja seu email.</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {setModalVisivel(false); navigation.navigate('Auth');}}>
              <Text style={styles.textStyle}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  negrito: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default CriarConta;
