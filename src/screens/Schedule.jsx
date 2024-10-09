import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import moment from "moment";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import FeatherIcon from "react-native-vector-icons/Feather";

const { width } = Dimensions.get("window");

const HomeSchedule = () => {
  const navigation = useNavigation();
  const swiper = useRef();
  const [value, setValue] = useState(moment().toDate());
  const [week, setWeek] = useState(0);

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

  const handleGoBack = () => {
    navigation.navigate("HOME");
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
            <Ionicons
              name="ellipsis-vertical"
              color="white"
              size={25}
            />
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

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={[styles.classSection, { paddingTop: 4 }]}>
            <View style={styles.classBody}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.classCard}
              >
                <Image
                  alt=""
                  source={{
                    uri: "https://res.cloudinary.com/imagehostingcloud/image/upload/v1728419706/canoagem_1_d0htnj.png",
                  }}
                  style={styles.classIcon}
                />
                <View style={styles.classInfo}>
                  <View style={styles.classHeader}>
                    <Text style={styles.className}>Canoagem</Text>
                    <View style={styles.participantsContainer}>
                      <Ionicons name="people-outline" color="white" size={14} />
                      <Text style={styles.participantsText}>0/27</Text>
                    </View>
                  </View>
                  <View style={styles.instructorContainer}>
                    <Ionicons name="person-outline" color="white" size={14} />
                    <Text style={styles.classInstructor} paddingHorizontal={3}>
                      Jefferson Junio
                    </Text>
                  </View>
                  <View style={styles.classTimeContainer}>
                    <Ionicons name="time-outline" color="white" size={14} />
                    <Text style={styles.classTime} paddingHorizontal={3}>
                      07:50 a 10:30
                    </Text>
                  </View>
                </View>
                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={22}
                  style={{ marginTop: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.classSection, { paddingTop: 4 }]}>
            <View style={styles.classBody}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.classCard}
              >
                <Image
                  alt=""
                  source={{
                    uri: "https://res.cloudinary.com/imagehostingcloud/image/upload/v1728488647/natacao_llrct1.png",
                  }}
                  style={styles.classIcon}
                />
                <View style={styles.classInfo}>
                  <View style={styles.classHeader}>
                    <Text style={styles.className}>Natação</Text>
                    <View style={styles.participantsContainer}>
                      <Ionicons name="people-outline" color="white" size={14} />
                      <Text style={styles.participantsText}>5/30</Text>
                    </View>
                  </View>
                  <View style={styles.instructorContainer}>
                    <Ionicons name="person-outline" color="white" size={14} />
                    <Text style={styles.classInstructor} paddingHorizontal={3}>
                      Daniel Oliveira
                    </Text>
                  </View>
                  <View style={styles.classTimeContainer}>
                    <Ionicons name="time-outline" color="white" size={14} />
                    <Text style={styles.classTime} paddingHorizontal={3}>
                      13:00 a 14:30
                    </Text>
                  </View>
                </View>
                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={22}
                  style={{ marginTop: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.classSection, { paddingTop: 4 }]}>
            <View style={styles.classBody}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.classCard}
              >
                <Image
                  alt=""
                  source={{
                    uri: "https://res.cloudinary.com/imagehostingcloud/image/upload/v1728489049/variante-de-bola-de-basquete_y7ixy4.png",
                  }}
                  style={styles.classIcon}
                />
                <View style={styles.classInfo}>
                  <View style={styles.classHeader}>
                    <Text style={styles.className}>Basquete</Text>
                    <View style={styles.participantsContainer}>
                      <Ionicons name="people-outline" color="white" size={14} />
                      <Text style={styles.participantsText}>10/15</Text>
                    </View>
                  </View>
                  <View style={styles.instructorContainer}>
                    <Ionicons name="person-outline" color="white" size={14} />
                    <Text style={styles.classInstructor} paddingHorizontal={3}>
                      Daniel Heller
                    </Text>
                  </View>
                  <View style={styles.classTimeContainer}>
                    <Ionicons name="time-outline" color="white" size={14} />
                    <Text style={styles.classTime} paddingHorizontal={3}>
                      07:30 a 09:30
                    </Text>
                  </View>
                </View>
                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={22}
                  style={{ marginTop: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.classSection, { paddingTop: 4 }]}>
            <View style={styles.classBody}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.classCard}
              >
                <Image
                  alt=""
                  source={{
                    uri: "https://res.cloudinary.com/imagehostingcloud/image/upload/v1728489173/voleibol_jn9i1l.png",
                  }}
                  style={styles.classIcon}
                />
                <View style={styles.classInfo}>
                  <View style={styles.classHeader}>
                    <Text style={styles.className}>Voleibol</Text>
                    <View style={styles.participantsContainer}>
                      <Ionicons name="people-outline" color="white" size={14} />
                      <Text style={styles.participantsText}>17/30</Text>
                    </View>
                  </View>
                  <View style={styles.instructorContainer}>
                    <Ionicons name="person-outline" color="white" size={14} />
                    <Text style={styles.classInstructor} paddingHorizontal={3}>
                      Renan Aderne
                    </Text>
                  </View>
                  <View style={styles.classTimeContainer}>
                    <Ionicons name="time-outline" color="white" size={14} />
                    <Text style={styles.classTime} paddingHorizontal={3}>
                      19:00 a 21:00
                    </Text>
                  </View>
                </View>
                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={22}
                  style={{ marginTop: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.classSection, { paddingTop: 4 }]}>
            <View style={styles.classBody}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.classCard}
              >
                <Image
                  alt=""
                  source={{
                    uri: "https://res.cloudinary.com/imagehostingcloud/image/upload/v1728489357/corrida_kk1qzy.png",
                  }}
                  style={styles.classIcon}
                />
                <View style={styles.classInfo}>
                  <View style={styles.classHeader}>
                    <Text style={styles.className}>Corrida</Text>
                    <View style={styles.participantsContainer}>
                      <Ionicons name="people-outline" color="white" size={14} />
                      <Text style={styles.participantsText}>9/10</Text>
                    </View>
                  </View>
                  <View style={styles.instructorContainer}>
                    <Ionicons name="person-outline" color="white" size={14} />
                    <Text style={styles.classInstructor} paddingHorizontal={3}>
                      Erick Salum
                    </Text>
                  </View>
                  <View style={styles.classTimeContainer}>
                    <Ionicons name="time-outline" color="white" size={14} />
                    <Text style={styles.classTime} paddingHorizontal={3}>
                      15:30 a 17:00
                    </Text>
                  </View>
                </View>
                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={22}
                  style={{ marginTop: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {/* Rodapé */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Registrar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeSchedule;

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
    color: "#999999",
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
    backgroundColor: "#1a1a1a",
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
  instructorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  classTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  participantsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantsText: {
    color: "white",
    fontSize: 14,
    marginLeft: 4,
  },

  classBody: {
    flexDirection: "row",
    alignItems: "center",
  },
  classCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
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
  className: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
  },
  classInstructor: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.white,
  },
  classTime: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.white,
  },
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
  },
});
