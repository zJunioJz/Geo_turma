import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../utils/colors";
import { SafeAreaView, StatusBar } from "react-native";""
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/UserContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_URL } from "@env";

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const { user, setUser, token } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [fieldToEdit, setFieldToEdit] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Função de validação de telefone
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/; // Formato: (xx) xxxxx-xxxx
    return phoneRegex.test(phone);
  };

  
// Função de mudança de telefone
const handlePhoneChange = (text) => {
  // Remove todos os caracteres que não são dígitos
  const cleaned = text.replace(/\D/g, '');

  // Formatação: (xx) xxxxx-xxxx
  let formatted = '';
  if (cleaned.length === 0) {
    formatted = '';
  } else if (cleaned.length <= 2) {
    formatted = `(${cleaned}`;
  } else if (cleaned.length <= 7) {
    formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  } else {
    formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  }
  
  setNewValue(formatted);
  setPhoneError("");
};

  // Função para abrir o modal
  const openModal = (field) => {
    setNewValue("");
    setOldPassword("");
    setPasswordError("");
    setPhoneError("");
    setFieldToEdit(field);
    setModalVisible(true);
  };

  // Função para manipulação da data
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setNewValue(currentDate.toLocaleDateString("pt-BR"));
  };

  // Função para salvar mudanças
  const handleSaveChange = async () => {
    if (!fieldToEdit || !newValue) {
      if (!fieldToEdit) {
        return; // Verifica se há um campo a ser editado
      }

      // Adiciona uma mensagem de erro para campos vazios
      if (fieldToEdit === "password") {
        setPasswordError("Os campos de senha não podem estar vazios.");
      }
      if (fieldToEdit === "phone") {
        setPhoneError("O campo de telefone não pode estar vazio.");
      }
      return;
    }

    if (fieldToEdit === "phone") {
      // Validação do telefone
      if (!newValue) {
        setPhoneError("");
        return;
      }
      if (!validatePhoneNumber(newValue)) {
        setPhoneError(
          "Número de telefone inválido. Use o formato (xx) xxxxx-xxxx."
        );
        return;
      } else {
        setPhoneError("");
      }
    }

    if (fieldToEdit === "password") {
      // Validações da senha
      if (newValue.length < 8) {
        setPasswordError("A nova senha deve ter pelo menos 8 caracteres.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/update-password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword: newValue,
          }),
        });

        const responseData = await response.json();

        if (response.ok) {
          alert("Senha atualizada com sucesso!");
          setModalVisible(false);
          setNewValue("");
        } else {
          console.error("Erro ao atualizar senha:", responseData);
          alert(responseData.message || "Erro ao atualizar senha.");
        }
      } catch (error) {
        console.error("Erro ao salvar mudanças:", error);
      } finally {
        setLoading(false);
      }
      return;
    }

    const dataToUpdate =
      fieldToEdit === "birthday"
        ? new Date(date).toISOString().split("T")[0]
        : newValue;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          [fieldToEdit]: dataToUpdate,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);

      if (response.ok) {
        const updatedUser = responseData;
        setUser(updatedUser);
        setModalVisible(false);
        setNewValue("");
      } else {
        console.error("Erro ao atualizar usuário:", responseData);
      }
    } catch (error) {
      console.error("Erro ao salvar mudanças:", error);
    } finally {
      setLoading(false);
    }
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name={"arrow-back-outline"}
            color={colors.white}
            size={25}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Meus Dados</Text>
        <TouchableOpacity style={styles.alertButton}>
          <Ionicons name="alert-circle-outline" color={colors.white} size={25} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="camera-outline" color={colors.white} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DADOS PESSOAIS</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <FeatherIcon name="user" size={20} color={colors.white} />
              <Text style={styles.label}>Nome</Text>
              <Text style={styles.value}>{user.username}</Text>
            </View>
            <TouchableOpacity
              onPress={() => openModal("phone")}
              style={styles.infoRow}
            >
              <FeatherIcon name="phone" size={20} color={colors.white} />
              <Text style={styles.label}>Celular</Text>
              <Text style={styles.value}>
                {user.phone || "(xx) xxxxx-xxxx"}
              </Text>
              <FeatherIcon color={colors.silver} name="chevron-right" size={19} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                openModal("birthday");
                setShowDatePicker(true);
              }}
              style={styles.infoRow}
            >
              <FeatherIcon name="calendar" size={20} color={colors.white} />
              <Text style={styles.label}>Data de Nascimento</Text>
              <Text style={styles.value}>
                {user.birthday
                  ? new Date(user.birthday).toLocaleDateString("pt-BR")
                  : "Selecionar Data"}
              </Text>
              <FeatherIcon color={colors.silver} name="chevron-right" size={19} />
            </TouchableOpacity>

            <View style={styles.infoRow}>
              <TouchableOpacity
                onPress={() => openModal("address")}
                style={styles.infoRow}
              >
                <FeatherIcon name="map-pin" size={20} color={colors.white} />
                <Text style={styles.label}>Endereço</Text>
                <Text style={styles.value}>{user.address}</Text>
                <FeatherIcon color={colors.silver} name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <FeatherIcon name="mail" size={20} color={colors.white} />
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => openModal("password")}
            >
              <Ionicons name="lock-closed" size={20} color={colors.white} />
              <Text
                style={[
                  styles.label,
                  styles.linkText,
                  { flex: 1, textAlign: "right" },
                ]}
              >
                Alterar Senha
              </Text>
              <FeatherIcon color={colors.silver} name="chevron-right" size={19} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REDES SOCIAIS</Text>
          <View style={styles.infoContainer}>
            <TouchableOpacity onPress={() => {}} style={styles.infoRow}>
              <Ionicons name="logo-google" color={colors.white} size={25} />
              <Text style={styles.label}>Google</Text>
              <Text style={[styles.value, styles.connectedText]}>
                Conectado
              </Text>
              <FeatherIcon color={colors.silver} name="chevron-right" size={19} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {}} style={styles.infoRow}>
              <Ionicons name="logo-microsoft" color={colors.white} size={25} />
              <Text style={styles.label}>Microsoft</Text>
              <Text style={[styles.value, styles.warningText]}>Conectar</Text>
              <FeatherIcon color={colors.silver} name="chevron-right" size={19} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {}} style={styles.infoRow}>
              <Ionicons name="logo-facebook" color={colors.white} size={25} />
              <Text style={styles.label}>Facebook</Text>
              <Text style={[styles.value, styles.warningText]}>Conectar</Text>
              <FeatherIcon color={colors.silver} name="chevron-right" size={19} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              Alterar{" "}
              {fieldToEdit === "password"
                ? "Senha"
                : fieldToEdit === "phone"
                  ? "Telefone Celular"
                  : fieldToEdit === "address"
                    ? "Endereço"
                    : "Data de Nascimento"}
            </Text>
            {fieldToEdit === "birthday" ? (
              <View>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeDate}
                  />
                )}
              </View>
            ) : fieldToEdit === "password" ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Senha antiga"
                  placeholderTextColor={colors.white}
                  secureTextEntry
                  value={oldPassword}
                  onChangeText={(text) => setOldPassword(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nova Senha"
                  placeholderTextColor={colors.white}
                  secureTextEntry
                  value={newValue}
                  onChangeText={(text) => setNewValue(text)}
                />
              </>
            ) : fieldToEdit === "phone" ? (
              <TextInput
                style={styles.input}
                placeholder="(xx) xxxxx-xxxx"
                placeholderTextColor={colors.white}
                value={newValue}
                onChangeText={handlePhoneChange}
                 keyboardType="phone-pad"
              />
            ) : fieldToEdit === "address" ? (
              <TextInput
                style={styles.input}
                placeholder="Endereço"
                placeholderTextColor={colors.white}
                value={newValue}
                onChangeText={(text) => setNewValue(text)}
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Data de Nascimento"
                placeholderTextColor={colors.white}
                value={newValue}
              />
            )}
            {fieldToEdit === "password" && passwordError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color={colors.red}
                  style={styles.errorIcon}
                />
                <Text style={styles.errorText}>{passwordError}</Text>
              </View>
            ) : null}
            {fieldToEdit === "phone" && phoneError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color={colors.red}
                  style={styles.errorIcon}
                />
                <Text style={styles.errorText}>{phoneError}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSaveChange}
              disabled={loading}
            >
              {loading ? ( // Exibindo o loading
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.saveButtonText}>Salvar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingHorizontal: 12,
  },
  backButton: {
    height: 40,
    width: 40,
    backgroundColor: colors.black,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
  alertButton: {
    height: 40,
    width: 40,
    backgroundColor: colors.black,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 19,
    fontWeight: "600",
    color: colors.white,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: "absolute",
    right: 150,
    bottom: 2,
    backgroundColor: colors.blue,
    borderRadius: 20,
    padding: 6,
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 5,
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    padding: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: colors.white,
    flex: 1,
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    color: colors.lightGray,
    marginLeft: 10,
  },
  connectedText: {
    color: colors.green,
  },
  warningText: {
    color: colors.blue,
  },
  linkText: {
    color: colors.cyan,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "80%",
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    color: colors.white,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: colors.grayMedium,
  },
  closeButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 40,
    paddingVertical: 5,
  },
  errorIcon: {
    marginEnd: 5,
    marginLeft: 15,
  },
  errorText: {
    color: colors.red,
  },
});

export default UserProfileScreen;
