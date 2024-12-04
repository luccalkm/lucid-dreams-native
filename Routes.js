import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const AppStack = createStackNavigator();

import Home from './Pages/Alunos';
import Form from './Pages/FormDeAluno';
import Auth from './Pages/Auth';
import Logado from './Pages/Logado';
import CriarConta from './Pages/CriarConta';

const Routes = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={{headerShown: false,  animationEnabled: true}}>
        <AppStack.Screen name="Auth" component={Auth} />
        <AppStack.Screen name="Logado" component={Logado} />
        <AppStack.Screen name="CriarConta" component={CriarConta} />
        <AppStack.Screen name="Alunos" component={Home} />
        <AppStack.Screen name="FormDeAluno" component={Form} />        
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
