import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native-virtualized-view";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    Alert,
    Modal,
    Keyboard,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { SIZES, FONTS, COLORS } from "@/constants";
import ConditionalComponent from "@/components/ConditionalComponent";


const notificationsData = [
    {
        id: "1",
        subject: "Obtenir une moyenne de 80% en mathématiques",
        type: "Progrès de l'enfant",
        time: "1j",
    },
    {
        id: "2",
        subject: "Terminer les exercices du Mathématiques",
        type: "Rappels d'objectifs",
        time: "1j",
    },
    {
        id: "3",
        subject: "Obtenir une moyenne de 70% en Histoire",
        type: "Rappels d'objectifs",
        time: "1j",
    },
    {
        id: "4",
        subject: "Nouvelle version de l'application à installer",
        type: "Mises à jour de l'application",
        time: "1j",
    },
    {
        id: "5",
        subject: "Abonnement presque épuisé",
        type: "Abonnement",
        time: "1j",
    },
    {
        id: "6",
        subject: "Abonnement presque épuisé",
        type: "Abonnement",
        time: "1j",
    },
    {
        id: "7",
        subject: "Abonnement presque épuisé",
        type: "Abonnement",
        time: "1j",
    },
    {
        id: "8",
        subject: "Abonnement presque épuisé",
        type: "Abonnement",
        time: "1j",
    },
];


const notificationTypes = ["Tous", ...Array.from(new Set(notificationsData.map(item => item.type)))];

const Historique = () => {
    const { colors } = useTheme();
    const [notifications, setNotifications] = useState(notificationsData);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Tous");
    const [isSearchActive, setIsSearchActive] = useState(false);

    const toggleSearch = () => {
        setIsSearchActive(!isSearchActive);
        if (isSearchActive) {
            setSearchQuery("");
        }
    };

    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);
        setShowFilterModal(false);
    };

    const filteredNotifications = notifications.filter(item => {
        const matchesSearch =
            item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.type.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = selectedFilter === "Tous" || item.type === selectedFilter;

        return matchesSearch && matchesFilter;
    });

    const handleDeleteHistory = () => {
        Alert.alert(
            "Confirmation",
            "Êtes-vous sûr de vouloir supprimer tout l'historique?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Supprimer",
                    onPress: () => setNotifications([]),
                    style: "destructive",
                },
            ]
        );
    };


    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                {isSearchActive ? (
                    <View style={styles.searchBarContainer}>
                        <TouchableOpacity onPress={toggleSearch}>
                            <Feather
                                name="arrow-left"
                                size={24}
                                color={colors.background === COLORS.dark1 ? COLORS.white : COLORS.black}
                            />
                        </TouchableOpacity>
                        <TextInput
                            style={[
                                styles.searchInput,
                                { color: colors.background === COLORS.dark1 ? COLORS.white : COLORS.black }
                            ]}
                            placeholder="Rechercher..."
                            placeholderTextColor={colors.background === COLORS.dark1 ? COLORS.greyscale600 : COLORS.gray}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                        {searchQuery !== "" && (
                            <TouchableOpacity onPress={() => setSearchQuery("")}>
                                <Feather
                                    name="x"
                                    size={20}
                                    color={colors.background === COLORS.dark1 ? COLORS.white : COLORS.black}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity style={styles.menuButton}>
                                <Feather
                                    name="menu"
                                    size={24}
                                    color={colors.background === COLORS.dark1 ? COLORS.white : COLORS.black}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={[
                            styles.headerTitle,
                            { color: colors.background === COLORS.dark1 ? '#FFFFFF' : '#000000' }
                        ]}>
                            Gestion et Historique
                        </Text>
                        <View style={styles.headerRight}>
                            <TouchableOpacity onPress={toggleSearch}>
                                <Feather
                                    name="search"
                                    size={24}
                                    color={colors.background === COLORS.dark1 ? COLORS.white : COLORS.black}
                                />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        );
    };


    const renderNotificationsSection = () => {
        return (
            <View style={[
                styles.sectionContainer,
                { backgroundColor: colors.background === COLORS.dark1 ? COLORS.dark2 : '#F4F4F4' }
            ]}>
                <View style={styles.notificationHeaderRow}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: colors.background === COLORS.dark1 ? COLORS.white : COLORS.black }
                    ]}>Notifications</Text>

                    {!isSearchActive && (
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                {
                                    backgroundColor: colors.background === COLORS.dark1 ? COLORS.dark3 : COLORS.white,
                                    borderColor: colors.background === COLORS.dark1 ? COLORS.dark3 : COLORS.greyscale300
                                }
                            ]}
                            onPress={() => {
                                Keyboard.dismiss();
                                setShowFilterModal(true);
                            }}
                        >
                            <Text style={[
                                styles.filterButtonText,
                                { color: colors.background === COLORS.dark1 ? COLORS.white : COLORS.black }
                            ]}>
                                {selectedFilter !== "Tous" ? selectedFilter : "Filtre"}
                            </Text>
                            <Feather
                                name="chevron-down"
                                size={16}
                                color={colors.background === COLORS.dark1 ? COLORS.white : COLORS.black}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView
                    style={[
                        styles.notificationsListContainer,
                        { backgroundColor: colors.background === COLORS.dark1 ? COLORS.dark3 : COLORS.white }
                    ]}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                >
                    {filteredNotifications.map((item, index) => (
                        <TouchableOpacity key={item.id} activeOpacity={0.7}>
                            <View style={[
                                styles.notificationItem,
                                {
                                    backgroundColor: colors.background === COLORS.dark1 ? COLORS.dark3 : COLORS.white,
                                    borderBottomColor: colors.background === COLORS.dark1 ? COLORS.dark2 : '#ECECEC'
                                }
                            ]}>
                                <View style={styles.notificationContent}>
                                    <Text style={[
                                        styles.notificationSubject,
                                        { color: colors.background === COLORS.dark1 ? COLORS.white : COLORS.black }
                                    ]}>
                                        {item.subject}
                                    </Text>
                                    <Text style={[
                                        styles.notificationType,
                                        { color: colors.background === COLORS.dark1 ? COLORS.greyscale400 : COLORS.greyscale600 }
                                    ]}>{item.type}</Text>
                                </View>
                                <Text style={[
                                    styles.notificationTime,
                                    { color: colors.background === COLORS.dark1 ? COLORS.greyscale400 : COLORS.greyscale600 }
                                ]}>{item.time}</Text>

                                <ConditionalComponent isValid={index % 2 === 0}>
                                    <View style={styles.orangeAccent} />
                                </ConditionalComponent>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };


    const renderHistoryManagement = () => {
        return (
            <View style={[
                styles.sectionContainer,
                { backgroundColor: colors.background === COLORS.dark1 ? COLORS.dark2 : '#F4F4F4' }
            ]}>
                <Text style={[
                    styles.sectionTitle,
                    { color: colors.background === COLORS.dark1 ? COLORS.white : COLORS.black }
                ]}>Gestion de l&apos;historique</Text>

                <View style={styles.historyActionContainer}>
                    <Text style={styles.deleteHistoryText}>
                        Supprimer tout l&apos;historique
                    </Text>
                    <TouchableOpacity
                        style={[
                            styles.confirmButton,
                            { backgroundColor: colors.background === COLORS.dark1 ? '#5A1616' : "#FFC0C0" }
                        ]}
                        onPress={handleDeleteHistory}
                    >
                        <Text style={styles.confirmButtonText}>Confirmer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    const renderFilterModal = () => {
        return (
            <Modal
                transparent
                visible={showFilterModal}
                animationType="fade"
                onRequestClose={() => setShowFilterModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={[
                                styles.modalContent,
                                { backgroundColor: colors.background === COLORS.dark1 ? COLORS.dark2 : COLORS.white }
                            ]}>
                                <Text style={[
                                    styles.modalTitle,
                                    { color: colors.background === COLORS.dark1 ? COLORS.primary : COLORS.primary }
                                ]}>
                                    Filtrer par
                                </Text>

                                <View style={[
                                    styles.modalDivider,
                                    { backgroundColor: colors.background === COLORS.dark1 ? COLORS.dark3 : COLORS.greyscale300 }
                                ]} />

                                {notificationTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.modalOption,
                                            {
                                                borderBottomColor: colors.background === COLORS.dark1 ?
                                                    COLORS.dark3 : COLORS.greyscale300
                                            }
                                        ]}
                                        onPress={() => handleFilterSelect(type)}
                                    >
                                        <Text style={[
                                            styles.modalOptionText,
                                            { color: colors.background === COLORS.dark1 ? COLORS.white : COLORS.black }
                                        ]}>
                                            {type}
                                        </Text>
                                        <View style={styles.radioButton}>
                                            {type === selectedFilter && (
                                                <View style={styles.radioButtonInner} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}

                                <TouchableOpacity
                                    style={styles.closeModalButton}
                                    onPress={() => setShowFilterModal(false)}
                                >
                                    <Text style={styles.closeModalButtonText}>Fermer</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {renderHeader()}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {renderNotificationsSection()}
                    {renderHistoryManagement()}
                </ScrollView>
                {renderFilterModal()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        marginBottom: 16,
    },
    headerLeft: {
        width: 40,
    },
    headerRight: {
        width: 40,
        alignItems: 'center',
    },
    menuButton: {
        padding: 8,
    },
    headerTitle: {
        ...FONTS.h2,
        textAlign: "center",
        flex: 1,
        color: '#000000',
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    sectionContainer: {
        marginBottom: 20,
        backgroundColor: '#F4F4F4',
        borderRadius: 12,
        padding: 16,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        ...FONTS.h3,
        color: COLORS.black,
        marginBottom: 16,
        fontWeight: 'bold',
    },

    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        paddingRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.greyscale300,
        paddingHorizontal: 12,
        marginLeft: 8,
        fontFamily: "regular",
        color: COLORS.black,
    },

    notificationHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.greyscale300,
        height: 44,
        paddingHorizontal: 16,
    },
    filterButtonText: {
        color: COLORS.black,
        fontFamily: "medium",
        marginRight: 8,
    },
    notificationsListContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        overflow: 'hidden',
    },
    notificationItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ECECEC',
        backgroundColor: COLORS.white,
        position: 'relative',
    },
    orangeAccent: {
        position: 'absolute',
        left: 0,
        top: 8,
        bottom: 8,
        width: 3,
        backgroundColor: COLORS.primary,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    notificationContent: {
        flex: 1,
        paddingRight: 12,
    },
    notificationSubject: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.black,
        marginBottom: 4,
    },
    notificationType: {
        fontSize: 12,
        fontFamily: "regular",
        color: COLORS.greyscale600,
    },
    notificationTime: {
        fontSize: 12,
        fontFamily: "medium",
        color: COLORS.greyscale600,
        marginLeft: 8,
    },
    historyActionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    deleteHistoryText: {
        fontSize: 14,
        fontFamily: "medium",
        color: "red",
    },
    confirmButton: {
        backgroundColor: "#FFC0C0",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    confirmButtonText: {
        color: "red",
        fontFamily: "medium",
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: SIZES.width * 0.8,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    modalDivider: {
        height: 1,
        backgroundColor: COLORS.greyscale300,
        marginBottom: 16,
    },
    modalOption: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.greyscale300,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalOptionText: {
        fontSize: 16,
        fontFamily: "medium",
        color: COLORS.black,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
    },
    closeModalButton: {
        marginTop: 20,
        paddingVertical: 12,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeModalButtonText: {
        color: COLORS.white,
        fontFamily: "bold",
        fontSize: 16,
    },
});

export default Historique;