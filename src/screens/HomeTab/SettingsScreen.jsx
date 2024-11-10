import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  StatusBar,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { colors } from "../../utils/colors";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useUser } from "../../context/UserContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogoutScreen from '../LogoutScreen';

export default function SettingsStack(){

  const Stack = createNativeStackNavigator();

  return (

    <Stack.Navigator initialRouteName="Settings" screenOptions={{headerShown: false}}>
    <Stack.Screen name="Settings" component={SettingsScreen}/>
    <Stack.Screen name="Logout" component={LogoutScreen}/>




    </Stack.Navigator>
  )

}


const SettingsScreen = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });

  const handleLogoutNavigation = () => {
    navigation.navigate("Logout");
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };
  
  const handleHome = () => {
    navigation.navigate("HomeTab");
  };

  const countMissingFields = () => {
    let count = 0;
    if (!user.phone) count++;
    if (!user.birthday) count++;
    if (!user.address) count++;
    return count;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleHome}>
          <Ionicons
            name={"arrow-back-outline"}
            color={colors.white}
            size={25}
          />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.headerTitle}>
          Configurações
        </Text>
        <View style={styles.headerAction}></View>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16 }}
      >
        <View style={[styles.section]}>
          <Text style={styles.sectionTitle}>Minha Conta</Text>

          <View style={styles.sectionBody}>
            <TouchableOpacity
              onPress={() => {
                /* handle onPress */
              }}
              style={styles.profile}
            >
              <Image
                alt=""
                source={{
                  uri:
                    user?.profilePicture ||
                    "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
                }}
                style={styles.profileAvatar}
              />

              <View style={styles.profileBody}>
                {user?.username && (
                  <Text style={styles.profileName}>{user.username}</Text>
                )}
                {user?.email && (
                  <Text style={styles.profileHandle}>{user.email}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências do Usuário</Text>

          <View style={styles.sectionBody}>
            <View style={styles.rowWrapper}>
              <TouchableOpacity style={styles.row} onPress={handleProfilePress}>
                <FeatherIcon
                  name="user"
                  size={20}
                  color={colors.white}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.rowLabel}>Meus Dados</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color={colors.silver}
                  name="chevron-right"
                  size={19}
                />

                {/* Ícone de contador */}
                {countMissingFields() > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{countMissingFields()}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  /* handle onPress */
                }}
                style={styles.row}
              >
                <FeatherIcon
                  name="map-pin"
                  size={19}
                  color={colors.white}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.rowLabel}>Localização</Text>
                <View style={styles.rowSpacer} />
                <Text style={styles.rowValue}>Brasil, RJ</Text>
                <FeatherIcon
                  color={colors.silver}
                  name="chevron-right"
                  size={19}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <View style={styles.row}>
                <FeatherIcon
                  name="bell"
                  size={19}
                  color={colors.white}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.rowLabel}>Notificações</Text>
                <View style={styles.rowSpacer} />
                <Switch
                  onValueChange={(Notificações) =>
                    setForm({ ...form, Notificações })
                  }
                  style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                  value={form.Notificações}
                />
              </View>
            </View>

            <View style={[styles.rowWrapper, styles.rowLast]}>
              <View style={styles.row}>
                <FeatherIcon
                  name="sun"
                  size={19}
                  color={colors.white}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.rowLabel}>Temas</Text>

                <View style={styles.rowSpacer} />
                <Switch
                  onValueChange={(theme) => setForm({ ...form, theme })}
                  style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                  value={form.theme}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos</Text>

          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  /* handle onPress */
                }}
                style={styles.row}
              >
                <FeatherIcon
                  name="phone"
                  size={19}
                  color={colors.white}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.rowLabel}>Fale Conosco</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color={colors.silver}
                  name="chevron-right"
                  size={19}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  /* handle onPress */
                }}
                style={styles.row}
              >
                <FeatherIcon
                  name="alert-circle"
                  size={19}
                  color={colors.white}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.rowLabel}>Reportar Bug</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color={colors.silver}
                  name="chevron-right"
                  size={19}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  /* handle onPress */
                }}
                style={styles.row}
              >
                <FeatherIcon
                  name="star"
                  size={19}
                  color={colors.white}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.rowLabel}>Avaliar na Play Store</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color={colors.silver}
                  name="chevron-right"
                  size={19}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.rowWrapper, styles.rowLast]}>
              <TouchableOpacity
                onPress={() => {
                  /* handle onPress */
                }}
                style={styles.row}
              >
                <FeatherIcon
                  name="file-text"
                  size={19}
                  color={colors.white}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.rowLabel}>Termos e Privacidade</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon
                  color={colors.silver}
                  name="chevron-right"
                  size={19}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View
              style={[
                styles.rowWrapper,
                styles.rowFirst,
                styles.rowLast,
                { alignItems: "center" },
              ]}
            >
              <TouchableOpacity
                onPress={handleLogoutNavigation}
                style={styles.row}
              >
                <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
                  Sair
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles remain unchanged

const styles = StyleSheet.create({
  /** Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 12,
    backgroundColor: colors.black,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: colors.white,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: "center",
  },
  /** Section */
  section: {
    paddingVertical: 10,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: "500",
    color: colors.white,
    textTransform: "uppercase",
  },
  sectionBody: {
    borderRadius: 10,
    shadowColor: "#000",
    backgroundColor: colors.darkGray,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.0,
    shadowRadius: 0,
    elevation: 0,
  },
  backButton: {
    height: 40,
    width: 40,
    backgroundColor: colors.black,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
  },
  /** Profile */
  profile: {
    padding: 12,
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    marginRight: 12,
  },
  profileBody: {
    marginRight: "auto",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
  },
  profileHandle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "400",
    color: colors.white,
  },
  /** Row */
  row: {
    height: 44,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 12,
  },
  rowWrapper: {
    paddingLeft: 16,
    borderBottomColor: colors.charcoalGray,
  },
  badgeContainer: {
    backgroundColor: colors.red,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 35,
    top: 12,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLabel: {
    fontSize: 16,
    letterSpacing: 0.24,
    color: colors.white,
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.lightGray,
    marginRight: 4,
  },
  rowLast: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  rowLabelLogout: {
    width: "100%",
    textAlign: "center",
    fontWeight: "600",
    color: colors.brightRed,
  },
});