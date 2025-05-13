import React from 'react';
import { Calendar } from 'react-native-calendars';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { faCalendar, faArrowRight, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { COLORS } from '../../../constants';
import styles from '../../../styles/FilterStyles';
import { EXERCISES_DATA } from '../../../data/Enfants/CHILDREN_DATA';
import { SUBJECTS_EXERCISES } from '../../../data/Enfants/SUBJECTS_EXERCISES';

// Définition des types pour les structures de données
type ExerciseDataType = {
    Mathématiques: string[];
    Français: string[];
    Histoire: string[];
    Sciences: string[];
    Anglais: string[];
    [key: string]: string[]; // Ajout d'un index signature
};

type ExerciseInfo = {
    id: number;
    name: string;
    difficulty: string;
};

// Type plus spécifique qui correspond à la structure réelle des données
type SubjectsExercisesType = {
    Mathématiques: {
        [chapter: string]: ExerciseInfo[];
    };
    Français: {
        [chapter: string]: ExerciseInfo[];
    };
    Histoire: {
        [chapter: string]: ExerciseInfo[];
    };
    Sciences: {
        [chapter: string]: ExerciseInfo[];
    };
    Anglais: {
        [chapter: string]: ExerciseInfo[];
    };
    [key: string]: {
        [chapter: string]: ExerciseInfo[];
    };
};

// Assertion de type pour corriger les erreurs
const typedEXERCISES_DATA = EXERCISES_DATA as ExerciseDataType;
const typedSUBJECTS_EXERCISES = SUBJECTS_EXERCISES as unknown as SubjectsExercisesType;

// Utility function to get progress color
function getProgressColor(progress: number) {
    if (progress < 30) return '#FC4E00';   // Rouge
    if (progress <= 50) return '#EBB016';  // Orange
    if (progress <= 70) return '#F3BB00';  // Jaune
    return '#24D26D';                      // Vert
}

interface FilterModalProps {
    showFilterModal: boolean;
    toggleFilterModal: () => void;
    advancedFilters: {
        selectedSubjects: string[];
        selectedChapters: string[];
        selectedExercises: string[];
        selectedAssistants: string[];
        scoreRange: {
            min: number;
            max: number;
        };
    };
    activityDateRange: {
        startDate: string | null;
        endDate: string | null;
    };
    showActivityCalendar: boolean;
    activityCalendarMode: 'start' | 'end';
    availableSubjects: string[];
    availableAssistants: string[];
    toggleActivityCalendar: (mode: 'start' | 'end') => void;
    handleActivityDayPress: (day: any) => void;
    setAdvancedFilters: (filters: any) => void;
    resetActivityFilters: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
    showFilterModal,
    toggleFilterModal,
    advancedFilters,
    activityDateRange,
    showActivityCalendar,
    activityCalendarMode,
    availableSubjects,
    availableAssistants,
    toggleActivityCalendar,
    handleActivityDayPress,
    setAdvancedFilters,
    resetActivityFilters
}) => {
    return (
        <Modal
            animationType="slide"
            transparent
            visible={showFilterModal}
            onRequestClose={toggleFilterModal}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filtres avancés</Text>
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={toggleFilterModal}
                        >
                            <FontAwesomeIcon icon={faTimesCircle} size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.modalScrollContentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Date Range Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Période</Text>

                            <View style={styles.dateRangeContainer}>
                                <View style={styles.datePickerWrapper}>
                                    <Text style={styles.dateLabel}>Début</Text>
                                    <TouchableOpacity
                                        style={styles.datePickerButton}
                                        onPress={() => toggleActivityCalendar('start')}
                                    >
                                        <Text style={styles.datePickerText}>
                                            {activityDateRange.startDate || "JJ/MM/AAAA"}
                                        </Text>
                                        <FontAwesomeIcon icon={faCalendar} size={18} color={COLORS.primary} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.dateSeparator}>
                                    <FontAwesomeIcon icon={faArrowRight} size={16} color={COLORS.gray} />
                                </View>

                                <View style={styles.datePickerWrapper}>
                                    <Text style={styles.dateLabel}>Fin</Text>
                                    <TouchableOpacity
                                        style={styles.datePickerButton}
                                        onPress={() => toggleActivityCalendar('end')}
                                    >
                                        <Text style={styles.datePickerText}>
                                            {activityDateRange.endDate || "JJ/MM/AAAA"}
                                        </Text>
                                        <FontAwesomeIcon icon={faCalendar} size={18} color={COLORS.primary} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {showActivityCalendar && (
                                <View style={styles.calendarContainer}>
                                    <Calendar
                                        onDayPress={handleActivityDayPress}
                                        markedDates={{
                                            [activityDateRange.startDate || '']: { selected: true, startingDay: true, color: COLORS.primary },
                                            [activityDateRange.endDate || '']: { selected: true, endingDay: true, color: COLORS.primary }
                                        }}
                                        theme={{
                                            todayTextColor: COLORS.primary,
                                            selectedDayBackgroundColor: COLORS.primary,
                                            selectedDayTextColor: '#ffffff',
                                            arrowColor: COLORS.primary,
                                            textDayFontFamily: 'Poppins-Regular',
                                            textMonthFontFamily: 'Poppins-Medium',
                                            textDayHeaderFontFamily: 'Poppins-Medium'
                                        }}
                                    />
                                </View>
                            )}
                        </View>

                        {/* Assistants Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Assistants</Text>
                            <View style={styles.filterChipsContainer}>
                                {availableAssistants.map(assistant => (
                                    <TouchableOpacity
                                        key={assistant}
                                        style={[
                                            styles.filterChip,
                                            advancedFilters.selectedAssistants.includes(assistant) && styles.selectedFilterChip
                                        ]}
                                        onPress={() => {
                                            const newAssistants = advancedFilters.selectedAssistants.includes(assistant)
                                                ? advancedFilters.selectedAssistants.filter(a => a !== assistant)
                                                : [...advancedFilters.selectedAssistants, assistant];

                                            setAdvancedFilters({ selectedAssistants: newAssistants });
                                        }}
                                    >
                                        <Text style={[
                                            styles.filterChipText,
                                            advancedFilters.selectedAssistants.includes(assistant) && styles.selectedFilterChipText
                                        ]}>
                                            {assistant}
                                        </Text>
                                        {advancedFilters.selectedAssistants.includes(assistant) && (
                                            <FontAwesomeIcon icon={faCheckCircle} size={16} color="#ffffff" style={styles.checkmarkIcon} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Subject Filter - Visible uniquement si "J'Apprends" est sélectionné */}
                        {advancedFilters.selectedAssistants.includes("J'Apprends") && (
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Matières</Text>
                                <View style={styles.filterChipsContainer}>
                                    {availableSubjects.map(subject => (
                                        <TouchableOpacity
                                            key={subject}
                                            style={[
                                                styles.filterChip,
                                                advancedFilters.selectedSubjects.includes(subject) && styles.selectedFilterChip
                                            ]}
                                            onPress={() => {
                                                const newSubjects = advancedFilters.selectedSubjects.includes(subject)
                                                    ? advancedFilters.selectedSubjects.filter(s => s !== subject)
                                                    : [...advancedFilters.selectedSubjects, subject];

                                                setAdvancedFilters({
                                                    selectedSubjects: newSubjects,
                                                    // Réinitialiser les chapitres si la matière est désélectionnée
                                                    selectedChapters: advancedFilters.selectedSubjects.includes(subject)
                                                        ? advancedFilters.selectedChapters.filter(ch => 
                                                            !typedEXERCISES_DATA[subject]?.includes(ch))
                                                        : advancedFilters.selectedChapters
                                                });
                                            }}
                                        >
                                            <Text style={[
                                                styles.filterChipText,
                                                advancedFilters.selectedSubjects.includes(subject) && styles.selectedFilterChipText
                                            ]}>
                                                {subject}
                                            </Text>
                                            {advancedFilters.selectedSubjects.includes(subject) && (
                                                <FontAwesomeIcon icon={faCheckCircle} size={16} color="#ffffff" style={styles.checkmarkIcon} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Chapters Filter - Visible uniquement si au moins une matière est sélectionnée */}
                        {advancedFilters.selectedAssistants.includes("J'Apprends") &&
                            advancedFilters.selectedSubjects.length > 0 && (
                                <View style={styles.filterSection}>
                                    <Text style={styles.filterSectionTitle}>Chapitres</Text>
                                    <View style={styles.filterChipsContainer}>
                                        {advancedFilters.selectedSubjects.map(subject =>
                                            typedEXERCISES_DATA[subject]?.map(chapter => (
                                                <TouchableOpacity
                                                    key={`${subject}-${chapter}`}
                                                    style={[
                                                        styles.filterChip,
                                                        advancedFilters.selectedChapters?.includes(chapter) && styles.selectedFilterChip,
                                                        { borderLeftWidth: 3, borderLeftColor: getProgressColor(75) } // Couleur indicative par matière
                                                    ]}
                                                    onPress={() => {
                                                        const selectedChapters = advancedFilters.selectedChapters || [];
                                                        const newChapters = selectedChapters.includes(chapter)
                                                            ? selectedChapters.filter(c => c !== chapter)
                                                            : [...selectedChapters, chapter];

                                                        setAdvancedFilters({ selectedChapters: newChapters });
                                                    }}
                                                >
                                                    <Text style={[
                                                        styles.filterChipText,
                                                        advancedFilters.selectedChapters?.includes(chapter) && styles.selectedFilterChipText
                                                    ]}>
                                                        {chapter}
                                                    </Text>
                                                    {advancedFilters.selectedChapters?.includes(chapter) && (
                                                        <FontAwesomeIcon icon={faCheckCircle} size={16} color="#ffffff" style={styles.checkmarkIcon} />
                                                    )}
                                                </TouchableOpacity>
                                            ))
                                        )}
                                    </View>
                                </View>
                            )}

                        {/* Exercises Filter - Visible uniquement si des chapitres sont sélectionnés */}
                        {advancedFilters.selectedAssistants.includes("J'Apprends") &&
                            advancedFilters.selectedChapters.length > 0 && (
                                <View style={styles.filterSection}>
                                    <Text style={styles.filterSectionTitle}>Exercices</Text>
                                    <View style={styles.filterChipsContainer}>
                                        {advancedFilters.selectedChapters.map(chapter =>
                                            advancedFilters.selectedSubjects.map(subject =>
                                                typedSUBJECTS_EXERCISES[subject]?.[chapter]?.map(exercise => (
                                                    <TouchableOpacity
                                                        key={`${subject}-${chapter}-${exercise.id}`}
                                                        style={[
                                                            styles.filterChip,
                                                            advancedFilters.selectedExercises?.includes(exercise.name) && styles.selectedFilterChip,
                                                            {
                                                                borderLeftWidth: 3,
                                                                borderLeftColor:
                                                                    exercise.difficulty === "Facile" ? "#24D26D" :
                                                                        exercise.difficulty === "Moyen" ? "#F3BB00" :
                                                                            "#FC4E00"
                                                            }
                                                        ]}
                                                        onPress={() => {
                                                            const selectedExercises = advancedFilters.selectedExercises || [];
                                                            const newExercises = selectedExercises.includes(exercise.name)
                                                                ? selectedExercises.filter(e => e !== exercise.name)
                                                                : [...selectedExercises, exercise.name];

                                                            setAdvancedFilters({ selectedExercises: newExercises });
                                                        }}
                                                    >
                                                        <Text style={[
                                                            styles.filterChipText,
                                                            advancedFilters.selectedExercises?.includes(exercise.name) && styles.selectedFilterChipText
                                                        ]}>
                                                            {exercise.name}
                                                        </Text>
                                                        <Text style={[
                                                            styles.difficultyIndicator,
                                                            advancedFilters.selectedExercises?.includes(exercise.name) ? styles.selectedDifficultyIndicator : {
                                                                color:
                                                                    exercise.difficulty === "Facile" ? "#24D26D" :
                                                                        exercise.difficulty === "Moyen" ? "#F3BB00" :
                                                                            "#FC4E00"
                                                            }
                                                        ]}>
                                                            {exercise.difficulty}
                                                        </Text>
                                                        {advancedFilters.selectedExercises?.includes(exercise.name) && (
                                                            <FontAwesomeIcon icon={faCheckCircle} size={16} color="#ffffff" style={styles.checkmarkIcon} />
                                                        )}
                                                    </TouchableOpacity>
                                                ))
                                            )
                                        )}
                                    </View>
                                </View>
                            )}

                        {/* Score Range Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Score</Text>
                            <View style={styles.scoreRangeContainer}>
                                <Text style={styles.scoreRangeText}>
                                    {advancedFilters.scoreRange.min}% - {advancedFilters.scoreRange.max}%
                                </Text>
                                <MultiSlider
                                    values={[advancedFilters.scoreRange.min, advancedFilters.scoreRange.max]}
                                    min={0}
                                    max={100}
                                    step={5}
                                    allowOverlap={false}
                                    snapped
                                    sliderLength={280}
                                    selectedStyle={{ backgroundColor: COLORS.primary }}
                                    markerStyle={styles.sliderMarker}
                                    containerStyle={styles.sliderContainer}
                                    onValuesChange={(values) => {
                                        setAdvancedFilters({
                                            scoreRange: {
                                                min: values[0],
                                                max: values[1]
                                            }
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    {/* Modal action buttons */}
                    <View style={styles.modalFooter}>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={resetActivityFilters}
                            >
                                <Text style={styles.clearButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.applyButton}
                                onPress={toggleFilterModal}
                            >
                                <Text style={styles.applyButtonText}>Appliquer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FilterModal;