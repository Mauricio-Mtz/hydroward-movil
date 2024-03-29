import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors';
import { API_URL } from './../config/url';

export default function Configuracion({ route }) {
    const navigation = useNavigation();
    const { estanqueId } = route.params;
    const [estanque, setEstanque] = useState({});
    const [alimentacion, setAlimentacion] = useState('');
    const [liberacionAlimento, setLiberacionAlimento] = useState('');
    const [durante, setDurante] = useState('');
    const [tempMin, setTempMin] = useState('');
    const [tempMax, setTempMax] = useState('');
    const [phMin, setPhMin] = useState('');
    const [phMax, setPhMax] = useState('');
    const [nombre, setNombre] = useState('');
    const [latitud, setLatitud] = useState('');
    const [longitud, setLongitud] = useState('');

    const cancelar = () => {
        navigation.navigate('Monitoreo', { estanqueId });
    };

    const getUserData = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await fetch(`${API_URL}/Login/obtenerUsuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                body: `id=${userId}`,
            });
            const data = await response.json();
            if (data.success) {
                console.log(data.message);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
        }
    };

    const getEstanque = async () => {
        try {
            console.log(estanqueId)
            const response = await fetch(`${API_URL}/Estanques/obtenerEstanqueC`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                body: `idEstanque=${estanqueId}`,
            });
            const data = await response.json();
            if (data.success) {
                const estanque = data.estanques[0]

                setNombre(estanque.nombre);
                setAlimentacion(estanque.alimentacion);
                setLiberacionAlimento(estanque.no_alim);
                setDurante(estanque.si_alim);
                setTempMin(estanque.temp_min);
                setTempMax(estanque.temp_max);
                setPhMin(estanque.ph_min);
                setPhMax(estanque.ph_max);
                setLatitud(estanque.latitud);
                setLongitud(estanque.longitud);

                setEstanque(estanque);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.error('Error al obtener los datos de los estanques:', error);
        }
    };

    const guardar = async () => {
        try {
            const data = {
                estanque: estanqueId,
                nombre: nombre,
                alimentacion: alimentacion,
                tempMax: tempMax,
                noAlim: liberacionAlimento,
                siAlim: durante,
                tempMin: tempMin,
                phMax: phMax,
                phMin: phMin,
                latitud: latitud,
                longitud: longitud
            };
            console.log('Datos a enviar al servidor:', data);
            const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
            console.log('Formulario a enviar al servidor:', formBody);
            const response = await fetch(`${API_URL}/Estanques/editarEstanque`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                body: formBody,
            });
            console.log(response.data);
            if (response.ok) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home'}],
                });
                alert('¡Parámetros actualizados con éxito!')
            } else {
                alert('¡Ha ocurrido un error en la solicitud!');
            }
        } catch (error) {
            console.error('Ha ocurrido un error:', error);
            alert('¡Ha ocurrido un error en la solicitud!');
        }
    };

    useEffect(() => {
        getEstanque();
        getUserData();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.section}>
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Estanque</Text>
                            <Text style={styles.subtitle}>Nombre:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={estanque.nombre ? estanque.nombre.toString() : 'Sin asignar'}
                                placeholderTextColor={colors.light}
                                onChangeText={setNombre}
                            />
                        </View>
                    </View>
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Alimentación</Text>
                            <Text style={styles.subtitle}>Tipo de alimentación:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={estanque.alimentacion ? estanque.alimentacion.toString() : 'Sin asignar'}
                                placeholderTextColor={colors.light}
                                onChangeText={setAlimentacion}
                            />
                            <Text style={styles.subtitle}>Liberación:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={estanque.no_alim ? 'Cada ' + estanque.no_alim.toString() + ':00 horas' : 'Sin asignar'}
                                placeholderTextColor={colors.light}
                                onChangeText={setLiberacionAlimento}
                                keyboardType='numeric'
                            />
                            <Text style={styles.subtitle}>Apertura:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={estanque.si_alim ? 'Durante ' + estanque.si_alim.toString() + ':00 horas' : 'Sin asignar'}
                                placeholderTextColor={colors.light}
                                onChangeText={setDurante}
                                keyboardType='numeric'
                            />
                        </View>
                    </View>
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Temperatura</Text>
                            <Text style={styles.subtitle}>Temperatura mínima:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={estanque.temp_min ? estanque.temp_min.toString() + ' C°' : 'Sin asignar'}
                                placeholderTextColor={colors.light}
                                onChangeText={setTempMin}
                                keyboardType='decimal-pad'
                            />
                            <Text style={styles.subtitle}>Temperatura máxima:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={estanque.temp_max ? estanque.temp_max.toString() + ' C°' : 'Sin asignar'}
                                placeholderTextColor={colors.light}
                                onChangeText={setTempMax}
                                keyboardType='decimal-pad'
                            />
                        </View>
                    </View>
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Ph</Text>
                            <Text style={styles.subtitle}>Ph mínimo:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={estanque.ph_min ? 'Ph = ' + estanque.ph_min.toString() : 'Sin asignar'}
                                placeholderTextColor={colors.light}
                                onChangeText={setPhMin}
                                keyboardType='decimal-pad'
                            />
                            <Text style={styles.subtitle}>Ph máximo:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={estanque.ph_max ? 'Ph = ' + estanque.ph_max.toString() : 'Sin asignar'}
                                placeholderTextColor={colors.light}
                                onChangeText={setPhMax}
                                keyboardType='decimal-pad'
                            />
                        </View>
                    </View>
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Ubicacion</Text>
                            <Text style={styles.subtitle}>latitud:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={estanque.latitud ? estanque.latitud.toString() : 'Sin asignar'}
                                placeholderTextColor={colors.light}
                                onChangeText={setLatitud}
                                keyboardType='decimal-pad'
                            />
                            <Text style={styles.subtitle}>longitud:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={estanque.longitud ? estanque.longitud.toString() : 'Sin asignar'}
                                placeholderTextColor={colors.light}
                                onChangeText={setLongitud}
                                keyboardType='decimal-pad'
                            />
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={cancelar} style={[styles.footerButton, { backgroundColor: colors.dangerText }]}>
                            <Text style={styles.footerButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={guardar} style={[styles.footerButton, { backgroundColor: colors.successText }]}>
                            <Text style={styles.footerButtonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bodyBg,
        paddingTop: 20,
    },
    section: {
        marginBottom: 20,
    },
    card: {
        backgroundColor: colors.lightBg,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: colors.borderColor,
        padding: 10,
        marginBottom: 10
    },
    cardContainer: {
        paddingHorizontal: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: colors.lightText,
    },
    containerTitle: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: colors.warning,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.warning,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.lightText,
        textAlign: 'center',
        marginBottom: 10,
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputColumn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputText: {
        fontSize: 14,
        color: colors.lightText,
        textAlign: 'center',
    },
    info: {
        fontSize: 16,
        color: colors.lightText,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.borderColor,
        borderRadius: 5,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: colors.lightText,
        textAlign: 'center',
    },
    scrollViewContainer: {
        flexGrow: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 25
    },
    footerButton: {
        borderRadius: 5,
        paddingVertical: 12,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2
    },
    footerButtonText: {
        color: colors.lightText,
        fontSize: 16,
        textAlign: 'center',
    },
    btns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    btn: {
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: colors.lightText,
        fontSize: 16,
        textAlign: 'center',
    },
});
