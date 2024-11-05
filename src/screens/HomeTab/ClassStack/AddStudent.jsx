 import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { API_BOOKING_URL } from "@env";
const port = process.env.PORT || 3001;

export default function AddStudent(){

    const [data, setData] = useState([]);

    //Exibe usuários para serem adicionadaos
    useEffect(() => {

        const fetchStudents = async () => {
            try {
                const response = await fetch(`${API_BOOKING_URL}/userData`); 

                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                console.log(response);
                const json = await response.json();
                setData(json);
                console.log(data);
            } catch (error) {
              console.error("Erro ao buscar dados:", error);
            }

          };
        fetchStudents();

    }, []);
    
    return (

        <View style={styles.container}>
        
           <FlatList
            data={data}
            renderItem = {(({item: user}) => {
                return (
                    
                    <Text style={{color: "white"}}> {user.username} </Text>
                )}
            )}
        />
           
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
})