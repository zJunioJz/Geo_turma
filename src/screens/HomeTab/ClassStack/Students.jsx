import {View, Text, StyleSheet} from 'react-native';
import CustomButton from '../../../components/CustomButton';

export default function Students({ navigation }) {

    return (
        <View style={styles.container}>
            <Text  style={styles.h1}> Alunos </Text>
            <CustomButton title="Adicionar aluno" color="white" backgroundColor="slateblue" onPressFunc={()=> navigation.navigate("AddStudent")}/>
        </View>

    )
}

const styles = StyleSheet.create({

    container: {

        flex: 1,
        alignItems: 'center',
        justifyContent: "flex-start",
        backgroundColor: "black"
    },

    h1: {

        color:  "white",
        fontSize: 30,
        fontWeight: 'bold'

    }







});
