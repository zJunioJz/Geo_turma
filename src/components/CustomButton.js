import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function CustomButton({title, onPressFunc, width, height, backgroundColor, color, fontSize, fontWeight, iconName, iconSize, borderRadius}){

    return (

        <TouchableOpacity 
            onPress={onPressFunc} 
            style={{
                flex: 0,
                flexDirection: 'row',
                minWidth: width,
                minHeight: height,
                borderRadius: borderRadius,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: backgroundColor,
                marginBottom: 5,
                overflow: 'hidden'
            }}>
            
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:"center", width: '80%'}}>
                <Text style={{
                    fontSize: fontSize,
                    fontWeight: fontWeight,
                    color: color,
                    marginLeft: 'auto'

                }}>
                    {title}
                </Text>
                <Ionicons name={iconName} color="white" size= {iconSize} style={{marginLeft: 'auto'}}/>
            </View>
        </TouchableOpacity>
    )
}
