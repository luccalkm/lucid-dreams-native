// Importando os componentes utilizados nessa página
import {StyleSheet} from 'react-native';

const estilo = StyleSheet.create({
  flatlist: {
    width: "100%"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf : 'center',
    width:"100%"
  },
  tableHeader: {
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#37C2D0",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: 50
  },
  tableBottom: {
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#37C2D0",
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    height: 20,
    alignSelf: 'stretch',
    paddingTop:10
  },
  columnHeader: {
    textAlign: "center",
    alignItems:"center"
  },
  columnHeaderTxt: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  tableRowBlue: {
    textAlign: "center",
    backgroundColor: "#F0FBFC",
    flexDirection: "row",
    height: 40,
    alignItems:"center",
  },
  tableRowWhite: {
    textAlign: "center",
    flexDirection: "row",
    height: 40,
    alignItems:"center",
  },
  columnRowTxt: {
    textAlign: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 5,
    height: 30,
    width: 250,
    backgroundColor: "#37C2D0",
    borderRadius: 5,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  containerForm: {
    alignItems: 'center',
  },
  topImage: {
    margin: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 20
  },
  input: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    fontSize: 16,
    padding: 5,
    width: 300
  }
});

export default estilo;