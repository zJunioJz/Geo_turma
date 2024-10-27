import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
} from "react-native";
import moment from "moment";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { imageMap } from "../utils/imageMap";
import { API_BOOKING_URL } from "@env";

const { width } = Dimensions.get("window");

const ScheduleScreen = () => {
  const navigation = useNavigation();
  const swiper = useRef();
  const [value, setValue] = useState(moment().toDate());
  const [week, setWeek] = useState(0);
  const [classes, setClasses] = useState([]);
  const [selectedModalidade, setSelectedModalidade] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [maxAlunos, setMaxAlunos] = useState("");
  const [date, setDate] = useState(new Date());
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BOOKING_URL}/all-classes`);
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.log("Erro ao buscar as turmas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const modalidades = ["Canoagem", "Corrida", "Voleibol", "Judô", "Ciclismo"];
  const professores = [
    "Jefferson Junio",
    "Daniel Oliveira",
    "Renan Aderne",
    "Daniel Heller",
  ];

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("pt-BR", options);
  };

  const dayTranslations = {
    Sun: "Dom",
    Mon: "Seg",
    Tue: "Ter",
    Wed: "Qua",
    Thu: "Qui",
    Fri: "Sex",
    Sat: "Sab",
  };

  const monthTranslations = {
    Jan: "Jan",
    Feb: "Fev",
    Mar: "Mar",
    Apr: "Abr",
    May: "Mai",
    Jun: "Jun",
    Jul: "Jul",
    Aug: "Ago",
    Sep: "Set",
    Oct: "Out",
    Nov: "Nov",
    Dec: "Dez",
  };

  const formattedDate = `${dayTranslations[moment(value).format("ddd")]}, ${moment(value).format("DD")} de ${monthTranslations[moment(value).format("MMM")]} de ${moment(value).format("YYYY")}`;

  const weeks = React.useMemo(() => {
    const start = moment().add(week, "weeks").startOf("week");
    return [-1, 0, 1].map((adj) => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, "week").add(index, "day");
        return {
          weekday: dayTranslations[date.format("ddd")],
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  const resetFields = () => {
    setSelectedModalidade("");
    setSelectedProfessor("");
    setMaxAlunos("");
    setDate(new Date());
    setSelectedTime(new Date());
    setSelectedEndTime(new Date());
  };

  const closeModal = () => {
    setModalVisible(false);
    resetFields();
  };

  const handleGoBack = () => {
    navigation.navigate("HOME");
  };

  const handleCreate = async () => {
    const maxAlunosNumber = parseInt(maxAlunos, 10);

    if (
      !selectedModalidade ||
      !selectedProfessor ||
      isNaN(maxAlunosNumber) ||
      !date ||
      !selectedTime ||
      !selectedEndTime
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const hoursStart = selectedTime.getHours().toString().padStart(2, "0");
    const minutesStart = selectedTime.getMinutes().toString().padStart(2, "0");
    const formattedStartTime = `${hoursStart}:${minutesStart}:00`;

    const hoursEnd = selectedEndTime.getHours().toString().padStart(2, "0");
    const minutesEnd = selectedEndTime.getMinutes().toString().padStart(2, "0");
    const formattedEndTime = `${hoursEnd}:${minutesEnd}:00`;

    const bookingData = {
      modalidade: selectedModalidade,
      professor: selectedProfessor,
      maxAlunos,
      date: date.toISOString().split("T")[0],
      start_time: formattedStartTime,
      end_time: formattedEndTime,
    };

    setLoading(true);

    try {
      const response = await fetch(`${API_BOOKING_URL}/create-booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      console.log("Dados do agendamento:", bookingData);

      if (response.ok) {
        const result = await response.json();
        Alert.alert("Sucesso", result.message);
        navigation.navigate("SCHEDULE");
        closeModal();
        fetchClasses();
      } else {
        const errorResult = await response.json();
        Alert.alert(
          "Erro",
          errorResult.error || "Não foi possível criar a turma."
        );
      }
    } catch (error) {
      console.error("Erro ao criar a turma:", error);
      Alert.alert("Erro", "Houve um problema ao criar a turma.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const CustomDatePicker = ({ visible, onClose }) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    const nextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    const prevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    const renderDays = () => {
      const today = new Date(); // Obter a data atual
      const totalDays = daysInMonth(currentMonth, currentYear);
      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysArray = [];

      // Adicionar dias em branco antes do primeiro dia do mês
      for (let i = 0; i < firstDay; i++) {
        daysArray.push(<View key={`empty-${i}`} style={styles.dayEmpty} />);
      }

      // Adicionar dias do mês
      for (let i = 1; i <= totalDays; i++) {
        const dayDate = new Date(currentYear, currentMonth, i);
        const isPastDate =
          dayDate < today && dayDate.toDateString() !== today.toDateString();
        const isToday = dayDate.toDateString() === today.toDateString(); // Verificar se é o dia atual

        daysArray.push(
          <TouchableOpacity
            key={`day-${i}`}
            style={[
              styles.day,
              (isPastDate ||
                (currentMonth < today.getMonth() &&
                  currentYear <= today.getFullYear())) &&
                styles.pastDate,
            ]}
            onPress={() => {
              if (!isPastDate) {
                // Verificar se a data não é passada
                const selectedDate = new Date(currentYear, currentMonth, i);
                setDate(selectedDate);
                onClose();
              }
            }}
            disabled={
              isPastDate ||
              (currentMonth < today.getMonth() &&
                currentYear <= today.getFullYear())
            } // Desabilitar o botão se for uma data passada
          >
            <Text
              style={[styles.dayText, isPastDate && styles.disabledDayText]}
            >
              {i}
            </Text>
          </TouchableOpacity>
        );
      }
      daysArray.push(<View key="line" style={styles.line} />);

      return daysArray;
    };

    return (
      <Modal visible={visible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.ModalTitle}>
              <TouchableOpacity onPress={prevMonth}>
                <Ionicons
                  name="chevron-back-outline"
                  size={25}
                  color={colors.white}
                />
              </TouchableOpacity>
              <Text style={styles.monthText}>
                {months[currentMonth]} {currentYear}
              </Text>
              <TouchableOpacity onPress={nextMonth}>
                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDays}>
              {daysOfWeek.map((day) => (
                <Text key={day} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.daysGrid}>{renderDays()}</View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.backContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons
              name={"arrow-back-outline"}
              color={colors.white}
              size={25}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ellipsisButton}>
            <Ionicons name="ellipsis-vertical" color="white" size={25} />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Calendário</Text>
        </View>

        {/* Seletor de datas */}
        <View style={styles.datePicker}>
          <Swiper
            index={1}
            ref={swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={(ind) => {
              if (ind === 1) {
                return;
              }
              setTimeout(() => {
                const newIndex = ind - 1;
                const newWeek = week + newIndex;
                setWeek(newWeek);
                setValue(moment(value).add(newIndex, "week").toDate());
                swiper.current.scrollTo(1, false);
              }, 100);
            }}
          >
            {weeks.map((dates, index) => (
              <View style={styles.weekRow} key={index}>
                {dates.map((item, dateIndex) => {
                  const isActive =
                    value.toDateString() === item.date.toDateString();
                  return (
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      onPress={() => setValue(item.date)}
                    >
                      <View
                        style={[
                          styles.dateItem,
                          isActive && {
                            backgroundColor: colors.white,
                            borderColor: "#111",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.weekdayText,
                            isActive && { color: colors.black },
                          ]}
                        >
                          {item.weekday}
                        </Text>
                        <Text
                          style={[
                            styles.dateText,
                            isActive && { color: colors.black },
                          ]}
                        >
                          {item.date.getDate()}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>

        {/* Conteúdo da agenda */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.selectedDate}>{formattedDate}</Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: loading ? "center" : "flex-start",
            alignItems: loading ? "center" : "stretch",
          }}
        >
          {loading ? (
            <ActivityIndicator
              size={60}
              color={colors.white}
              style={{ marginBottom: 100 }}
            />
          ) : (
            classes.map((classItem) => (
              <View
                key={classItem.id}
                style={[styles.classSection, { paddingTop: 4 }]}
              >
                <View style={styles.classBody}>
                  <TouchableOpacity
                    onPress={() => {
                      // handle onPress
                    }}
                    style={styles.classCard}
                  >
                    <Image
                      source={{
                        uri:
                          imageMap[classItem.modalidade] ||
                          "https://res.cloudinary.com/imagehostingcloud/image/upload/v1729981363/placeholder_y98l4g.png",
                      }}
                      style={styles.classIcon}
                    />
                    <View style={styles.classInfo}>
                      <View style={styles.classHeader}>
                        <Text style={styles.className}>
                          {classItem.modalidade}
                        </Text>
                        <View style={styles.participantsContainer}>
                          <Ionicons
                            name="people-outline"
                            color={colors.white}
                            size={14}
                          />
                          <Text style={styles.participantsText}>
                            0/{classItem.max_alunos}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.instructorContainer}>
                        <Ionicons
                          name="person-outline"
                          color={colors.white}
                          size={14}
                        />
                        <Text
                          style={[
                            styles.classInstructor,
                            { paddingHorizontal: 3 },
                          ]}
                        >
                          {classItem.professor}
                        </Text>
                      </View>
                      <View style={styles.classDateTimeContainer}>
                        <Ionicons
                          name="calendar-outline"
                          color={colors.white}
                          size={14}
                        />
                        <Text
                          style={[
                            styles.classDateTime,
                            { paddingHorizontal: 3 },
                          ]}
                        >
                          {new Date(classItem.date).toLocaleDateString("pt-BR")}
                        </Text>
                      </View>
                      <View style={styles.classTimeContainer}>
                        <Ionicons
                          name="time-outline"
                          color={colors.white}
                          size={14}
                        />
                        <Text
                          style={[styles.classTime, { paddingHorizontal: 3 }]}
                        >
                          {classItem.start_time.slice(0, 5)} a{" "}
                          {classItem.end_time.slice(0, 5)}
                        </Text>
                      </View>
                    </View>
                    <FeatherIcon
                      color={colors.silver}
                      name="chevron-right"
                      size={22}
                      style={{ marginTop: 4 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Rodapé */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Adicionar Turma</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalBooking}>
              <ScrollView>
                <View style={[styles.card, { alignSelf: "center" }]}>
                  <View style={styles.backContainerModal}>
                    <TouchableOpacity
                      style={styles.backButtonModal}
                      onPress={closeModal}
                    >
                      <Ionicons
                        name={"arrow-back-outline"}
                        color={colors.white}
                        size={22}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.AlertButtonModal}>
                      <Ionicons name="alert-circle" color="white" size={22} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.label}>Modalidade</Text>
                  <Picker
                    selectedValue={selectedModalidade}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      setSelectedModalidade(itemValue)
                    }
                  >
                    <Picker.Item label="Selecione uma modalidade" value="" />
                    {modalidades.map((mod, index) => (
                      <Picker.Item key={index} label={mod} value={mod} />
                    ))}
                  </Picker>

                  <Text style={styles.label}>Professor</Text>
                  <Picker
                    selectedValue={selectedProfessor}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      setSelectedProfessor(itemValue)
                    }
                  >
                    <Picker.Item label="Selecione um professor" value="" />
                    {professores.map((prof, index) => (
                      <Picker.Item key={index} label={prof} value={prof} />
                    ))}
                  </Picker>

                  <Text style={styles.label}>Quantidade Máxima de Alunos</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Digite o número máximo de alunos"
                    placeholderTextColor={colors.white}
                    value={maxAlunos}
                    onChangeText={setMaxAlunos}
                  />

                  <Text style={styles.label}>Data</Text>
                  <TouchableOpacity
                    onPress={() => setShowCustomDatePicker(true)}
                  >
                    <Text
                      style={[
                        styles.dateButton,
                        { color: colors.white, textAlign: "center" },
                      ]}
                    >
                      {formatDate(date)}
                    </Text>
                  </TouchableOpacity>

                  {showCustomDatePicker && (
                    <CustomDatePicker
                      visible={showCustomDatePicker}
                      onClose={() => setShowCustomDatePicker(false)}
                    />
                  )}

                  <Text style={styles.label}>Horário de Início</Text>
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    style={styles.dateButton}
                  >
                    <Text style={styles.dateCustom}>
                      {formatTime(selectedTime)}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={selectedTime}
                      mode="time"
                      display="spinner"
                      onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) {
                          setSelectedTime(selectedTime);
                        }
                      }}
                    />
                  )}

                  <Text style={styles.label}>Horário de Fim</Text>
                  <TouchableOpacity
                    onPress={() => setShowEndTimePicker(true)}
                    style={styles.dateButton}
                  >
                    <Text style={styles.dateCustom}>
                      {formatTime(selectedEndTime)}
                    </Text>
                  </TouchableOpacity>
                  {showEndTimePicker && (
                    <DateTimePicker
                      value={selectedEndTime}
                      mode="time"
                      display="spinner"
                      onChange={(event, selectedTime) => {
                        setShowEndTimePicker(false);
                        if (selectedTime) {
                          setSelectedEndTime(selectedTime);
                        }
                      }}
                    />
                  )}

                  <TouchableOpacity
                    onPress={handleCreate}
                    style={styles.createButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.createButtonText}>Criar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    backgroundColor: colors.black,
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  header: {
    paddingHorizontal: 16,
  },
  backButton: {
    height: 40,
    width: 40,
    backgroundColor: colors.black,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 40,
  },
  ellipsisButton: {
    height: 40,
    width: 40,
    backgroundColor: colors.black,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 12,
  },
  datePicker: {
    height: 80,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedDate: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.mediumGray,
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 16,
  },
  /** Item */
  dateItem: {
    flex: 1,
    height: 50,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.darkGray,
    flexDirection: "column",
    alignItems: "center",
  },
  weekRow: {
    width: width,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  weekdayText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.white,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: -5,
    color: colors.white,
  },
  /** Class Section */
  classSection: {
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  classBody: {
    flexDirection: "row",
    alignItems: "center",
  },
  classCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.charcoalGray,
    padding: 16,
    borderRadius: 8,
    flex: 1,
  },
  classIcon: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  classInfo: {
    flex: 1,
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  className: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
  },
  participantsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantsText: {
    color: colors.white,
    fontSize: 14,
    marginLeft: 4,
  },
  instructorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  classInstructor: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.white,
  },
  classDateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  classDateTime: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.white,
  },
  classTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  classTime: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.white,
  },
  btn: {
    backgroundColor: colors.blue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
  },
  /** Modal */
  modalBooking: {
    backgroundColor: colors.charcoalGray,
    padding: 20,
    borderRadius: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  backContainerModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    padding: 8,
  },
  backButtonModal: {
    height: 40,
    width: 40,
    backgroundColor: colors.charcoalGray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -10,
  },
  AlertButtonModal: {
    height: 40,
    width: 40,
    backgroundColor: colors.charcoalGray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: -10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#0d0d0d",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },

  dateCustom: {
    color: colors.white,
  },
  ModalTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 50,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
    flex: 1,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: colors.white,
    position: "absolute",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  weekDayText: {
    color: colors.white,
    width: 30,
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  day: {
    width: "14.28%",
    alignItems: "center",
    marginVertical: 5,
  },
  dayEmpty: {
    width: "14.28%",
    marginVertical: 5,
  },
  dayText: {
    marginTop: 2,
    color: colors.white,
  },
  closeButtonText: {
    color: colors.coralRed,
  },
  closeButton: {
    marginTop: 20,
  },

  disabledDayText: {
    color: colors.charcoalGray,
  },
  card: {
    backgroundColor: colors.charcoalGray,
    padding: 20,
    borderRadius: 10,
    width: "110%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.white,
  },
  picker: {
    height: 50,
    marginBottom: 16,
    color: colors.white,
  },
  input: {
    borderColor: colors.secondary,
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 10,
    color: colors.white,
    backgroundColor: colors.darkGray,
  },
  dateButton: {
    padding: 10,
    borderColor: colors.secondary,
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.darkGray,
  },
  createButton: {
    backgroundColor: colors.black,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default ScheduleScreen;
