import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  View, Text, Alert, Modal,
  TextInput, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { faStar, faBook, faClock, faClose, faArrowLeft, faPaperPlane, faPlayCircle, faCheckCircle, faTimesCircle, faChevronRight, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import type { Child, Activity} from '../../../data/Enfants/CHILDREN_DATA';

import { COLORS } from '../../../constants/theme';
import { useTheme } from '../../../theme/ThemeProvider';
import styles from '../../../styles/HistorydetailsStyls';
import { CHILDREN_DATA, enhanceActivity } from '../../../data/Enfants/CHILDREN_DATA';
import { SUBJECT_THEME, ASSISTANT_THEME } from '../../../data/Enfants/historydetails';

// Define an interface for the theme
interface ThemeItem {
  colors: readonly [string, string];
  icon: IconDefinition;
}

// Mapping des assistants avec leurs couleurs et icônes
interface AssistantThemeType {
  colors: string[];
  icon: any; // Utilisez le type IconDefinition si vous avez importé ce type
}

interface SubjectThemeType {
  colors: string[];
  icon: any; // Utilisez le type IconDefinition si vous avez importé ce type
}

const HistoryDetails = () => {
  const router = useRouter();
  const { dark, colors } = useTheme();
  const params = useLocalSearchParams();

  // Récupérer les IDs
  const activityId = Number(params.activityId);
  const childId = Number(params.childId);

  // États
  const [child, setChild] = useState<Child | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [feedback, setFeedback] = useState('');
  const [blocageIdentified, setBlockageIdentified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [parentFeedbacks, setParentFeedbacks] = useState<Array<{ text: string, date: Date }>>([]);
  const [showAllChat, setShowAllChat] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState('');
  const [editingFeedbackIndex, setEditingFeedbackIndex] = useState<number | null>(null);

  // Récupérer les données
  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true);

        // Trouver l'enfant
        const foundChild = CHILDREN_DATA.find(c => c.id === childId);
        if (!foundChild) {
          Alert.alert("Erreur", "Enfant non trouvé");
          router.back();
          return;
        }
        setChild(foundChild);

        // Trouver l'activité
        const foundActivity = foundChild.activitesRecentes.find(a => a.id === activityId);
        if (!foundActivity) {
          Alert.alert("Erreur", "Activité non trouvée");
          router.back();
          return;
        }

        // Enrichir les données
        const enhancedActivity = enhanceActivity(foundActivity);
        setActivity(enhancedActivity);

        // Simuler des feedbacks
        setParentFeedbacks([
          { text: "Bon travail sur cette activité. On voit des progrès!", date: new Date(2025, 2, 22) }
        ]);

      } catch (error) {
        console.error("Erreur:", error);
        Alert.alert("Erreur", "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [childId, activityId , router]);

  // Ajouter un feedback
  const addFeedback = () => {
    if (feedback.trim() === '') {
      Alert.alert("Erreur", "Veuillez saisir une commentaire");
      return;
    }

    setParentFeedbacks(prev => [
      ...prev,
      { text: feedback, date: new Date() }
    ]);

    setFeedback('');
    Alert.alert("Succès", "Votre commentaire a été ajouté");
  };

  // Marquer un point de blocage
  const toggleBlockageIdentification = () => {
    setBlockageIdentified(!blocageIdentified);
    if (!blocageIdentified) {
      Alert.alert(
        "Point de blocage identifié",
        "Cette activité a été marquée comme contenant un point de blocage."
      );
    }
  };

  // Retour
  const handleBack = () => {
    router.back();
  };

  // Ouvrir modal pour éditer un feedback
  const openEditFeedbackModal = (index: number) => {
    setEditingFeedbackIndex(index);
    setEditingFeedback(parentFeedbacks[index].text);
    setShowFeedbackModal(true);
  };

  // Mettre à jour un feedback
  const updateFeedback = () => {
    if (editingFeedbackIndex === null || editingFeedback.trim() === '') return;

    const updatedFeedbacks = [...parentFeedbacks];
    updatedFeedbacks[editingFeedbackIndex] = {
      ...updatedFeedbacks[editingFeedbackIndex],
      text: editingFeedback
    };

    setParentFeedbacks(updatedFeedbacks);
    setShowFeedbackModal(false);
    Alert.alert("Succès", "Votre commentaire a été modifié");
  };

  // Supprimer un feedback
  const deleteFeedback = () => {
    if (editingFeedbackIndex === null) return;

    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer cette commentaire ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          onPress: () => {
            const updatedFeedbacks = parentFeedbacks.filter((_, index) => index !== editingFeedbackIndex);
            setParentFeedbacks(updatedFeedbacks);
            setShowFeedbackModal(false);
            Alert.alert("Succès", "Votre commentaire a été supprimé");
          },
          style: "destructive"
        }
      ]
    );
  };

  // Affichage du chargement
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 20, color: dark ? COLORS.white : COLORS.black }}>
            Chargement des détails...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Données introuvables
  if (!activity || !child) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <FontAwesomeIcon
            icon={faExclamationCircle}
            size={64}
            color={dark ? COLORS.white : COLORS.black}
          />
          <Text style={{ marginTop: 20, color: dark ? COLORS.white : COLORS.black }}>
            Données introuvables
          </Text>
          <TouchableOpacity
            style={{ marginTop: 20, backgroundColor: COLORS.primary, padding: 12, borderRadius: 8 }}
            onPress={handleBack}
          >
            <Text style={{ color: COLORS.white }}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Variables pour le thème
  const assistantName = activity.assistant || "Autre";
  const assistantTheme = ASSISTANT_THEME[assistantName] || ASSISTANT_THEME.Autre;
  const subjectName = activity.matiere || "Autre";
  const subjectTheme = SUBJECT_THEME[subjectName] || SUBJECT_THEME.Autre;

  // Date formatée
  const activityDate = new Date(activity.date);
  const formattedDate = activityDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Messages de conversation limités (3 premiers)
  const limitedConversation = activity.conversation ? activity.conversation.slice(0, 3) : [];

  const renderFeedbackModal = () => (
    <Modal
      visible={showFeedbackModal}
      transparent
      animationType="slide"
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ width: '90%', backgroundColor: dark ? COLORS.dark1 : COLORS.white, borderRadius: 12, padding: 20 }}>
          <TouchableOpacity onPress={() => setShowFeedbackModal(false)} style={{ alignSelf: 'flex-end' }}>
            <FontAwesomeIcon icon={faClose} size={24} color={dark ? COLORS.white : COLORS.black} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: dark ? COLORS.white : COLORS.black, marginBottom: 20 }}>
            Éditer le commentaire
          </Text>
          <TextInput
            value={editingFeedback}
            onChangeText={setEditingFeedback}
            multiline
            style={{
              backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              borderRadius: 8,
              padding: 12,
              color: dark ? COLORS.white : COLORS.black,
              marginBottom: 20
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={updateFeedback}
              style={{ backgroundColor: COLORS.primary, padding: 12, borderRadius: 8, flex: 1, marginRight: 10 }}
            >
              <Text style={{ color: COLORS.white, textAlign: 'center' }}>Mettre à jour</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={deleteFeedback}
              style={{ backgroundColor: '#FF3B30', padding: 12, borderRadius: 8, flex: 1, marginLeft: 10 }}
            >
              <Text style={{ color: COLORS.white, textAlign: 'center' }}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} size={24} color={dark ? COLORS.white : COLORS.black} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: dark ? COLORS.white : COLORS.black }}>
              Détails de l&apos;activité
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: blocageIdentified ? 'rgba(255, 0, 0, 0.2)' : 'transparent'
            }}
            onPress={toggleBlockageIdentification}
          >
            <FontAwesomeIcon
              icon={faExclamationCircle}
              size={24}
              color={blocageIdentified ? '#FF3B30' : (dark ? COLORS.secondaryWhite : COLORS.gray3)}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Carte principale de l'activité */}
          <View style={{
            margin: 16,
            padding: 16,
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2
          }}>
            {/* En-tête avec type d'assistant et date */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <LinearGradient
                colors={assistantTheme.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20
                }}
              >
                <FontAwesomeIcon icon={assistantTheme.icon} size={14} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={{ color: '#FFF', fontWeight: '600' }}>{assistantName}</Text>
              </LinearGradient>
              <Text style={{ color: dark ? COLORS.secondaryWhite : COLORS.gray3 }}>
                {formattedDate}
              </Text>
            </View>

            {/* Titre de l'activité */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <LinearGradient
                colors={subjectTheme.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  marginRight: 12
                }}
              >
                <FontAwesomeIcon icon={subjectTheme.icon} size={16} color="#FFF" />
              </LinearGradient>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: dark ? COLORS.white : COLORS.black,
                flex: 1
              }}>
                {activity.activite}
              </Text>
            </View>

            {/* Détails de l'activité */}
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 16,
              padding: 12,
              backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              borderRadius: 8
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 8 }}>
                <FontAwesomeIcon icon={faClock} size={16} color={COLORS.primary} style={{ marginRight: 4 }} />
                <Text style={{ color: dark ? COLORS.secondaryWhite : COLORS.gray3 }}>{activity.duree}</Text>
              </View>
              {activity.score && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <FontAwesomeIcon icon={faStar} size={16} color={COLORS.primary} style={{ marginRight: 4 }} />
                  <Text style={{ color: dark ? COLORS.secondaryWhite : COLORS.gray3 }}>{activity.score}</Text>
                </View>
              )}
            </View>

            {/* Conversations (limitées) */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: dark ? COLORS.white : COLORS.black,
                marginBottom: 8,
                paddingHorizontal: 12
              }}>
                Conversation avec l&apos;assistant
              </Text>

              <TouchableOpacity
                onPress={() => {
                  if (activity && child) {
                    router.push(`/Enfants/Historique/chat?activityId=${activity.id}&childId=${child.id}&fromDetails=true`);
                  }
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  marginBottom: 8
                }}
              >
                <Text style={{ color: COLORS.primary, marginRight: 4 }}>Voir tout</Text>
                <FontAwesomeIcon icon={faChevronRight} size={16} color={COLORS.primary} />
              </TouchableOpacity>

              <View style={{
                backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                borderRadius: 8,
                padding: 12
              }}>
                {limitedConversation.map((msg, index) => (
                  <View
                    key={index}
                    style={{
                      marginBottom: index < limitedConversation.length - 1 ? 12 : 0,
                      alignItems: msg.sender === 'assistant' ? 'flex-start' : 'flex-end'
                    }}
                  >
                    <View style={{
                      backgroundColor: msg.sender === 'assistant'
                        ? (dark ? 'rgba(0, 149, 255, 0.2)' : 'rgba(0, 149, 255, 0.1)')
                        : (dark ? 'rgba(66, 66, 66, 0.8)' : '#E1E1E1'),
                      padding: 12,
                      borderRadius: 12,
                      maxWidth: '80%'
                    }}>
                      <Text style={{
                        color: msg.sender === 'assistant'
                          ? COLORS.primary
                          : (dark ? COLORS.white : COLORS.black)
                      }}>
                        {msg.message}
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        color: dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        alignSelf: 'flex-end',
                        marginTop: 4
                      }}>
                        {msg.timestamp}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Commentaires et recommandations */}
            {activity.commentaires && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: dark ? COLORS.white : COLORS.black,
                  marginBottom: 8
                }}>
                  Commentaires
                </Text>
                <View style={{
                  backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderRadius: 8,
                  padding: 12
                }}>
                  <Text style={{ color: dark ? COLORS.secondaryWhite : COLORS.gray3 }}>
                    {activity.commentaires}
                  </Text>
                </View>
              </View>
            )}

            {activity.recommandations && activity.recommandations.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: dark ? COLORS.white : COLORS.black,
                  marginBottom: 8
                }}>
                  Commentaire
                </Text>
                <View style={{
                  backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderRadius: 8,
                  padding: 12
                }}>
                  {activity.recommandations.map((rec, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: index < activity.recommandations!.length - 1 ? 8 : 0
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        size={18}
                        color={COLORS.primary}
                        style={{ marginRight: 8 }}
                      />
                      <Text style={{ color: dark ? COLORS.secondaryWhite : COLORS.gray3 }}>
                        {rec}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Exercices */}
            {activity.exercices && activity.exercices.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: dark ? COLORS.white : COLORS.black,
                  marginBottom: 8
                }}>
                  Exercices
                </Text>
                <View style={{
                  backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderRadius: 8,
                  padding: 12
                }}>
                  {activity.exercices.map((ex, index) => (
                    <View
                      key={index}
                      style={{
                        marginBottom: index < activity.exercices!.length - 1 ? 12 : 0
                      }}
                    >
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 4
                      }}>
                        <FontAwesomeIcon
                          icon={ex.reussite ? faCheckCircle : faTimesCircle}
                          size={18}
                          color={ex.reussite ? '#4CAF50' : '#F44336'}
                          style={{ marginRight: 8 }}
                        />
                      </View>
                      {ex.commentaire && (
                        <Text style={{
                          color: dark ? COLORS.secondaryWhite : COLORS.gray3,
                          marginLeft: 26
                        }}>
                          {ex.commentaire}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Feedback des parents */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: dark ? COLORS.white : COLORS.black,
                marginBottom: 8
              }}>
                Commentaires des parents
              </Text>
              <View style={{
                backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                borderRadius: 8,
                padding: 12,
                marginBottom: 12
              }}>
                {parentFeedbacks.length > 0 ? (
                  parentFeedbacks.map((fb, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        marginBottom: index < parentFeedbacks.length - 1 ? 12 : 0
                      }}
                      onPress={() => openEditFeedbackModal(index)}
                    >
                      <Text style={{ color: dark ? COLORS.secondaryWhite : COLORS.gray3 }}>
                        {fb.text}
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        color: dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        alignSelf: 'flex-end',
                        marginTop: 4
                      }}>
                        {fb.date.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ color: dark ? COLORS.secondaryWhite : COLORS.gray3, fontStyle: 'italic' }}>
                    Aucun commentaire pour le moment
                  </Text>
                )}

                {/* Ajouter un feedback */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderRadius: 8,
                  padding: 8
                }}>
                  <TextInput
                    placeholder="Ajouter une commentaire ..."
                    placeholderTextColor={dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                    value={feedback}
                    onChangeText={setFeedback}
                    multiline
                    style={{
                      flex: 1,
                      color: dark ? COLORS.white : COLORS.black,
                      paddingHorizontal: 8
                    }}
                  />
                  <TouchableOpacity
                    onPress={addFeedback}
                    style={{
                      padding: 8,
                      backgroundColor: COLORS.primary,
                      borderRadius: 8
                    }}
                    disabled={feedback.trim() === ''}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Ressources pédagogiques */}
            {assistantName === "J'Apprends" && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: dark ? COLORS.white : COLORS.black,
                  marginBottom: 8
                }}>
                  Ressources pédagogiques
                </Text>
                <TouchableOpacity
                  onPress={() => router.push(`/Enfants/Historique/fichedetails?resourceId=1&subject=${subjectName}`)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 8
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBook}
                    size={24}
                    color={COLORS.primary}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
                      Fiche pédagogique - {subjectName}
                    </Text>
                    <Text style={{ color: dark ? COLORS.secondaryWhite : COLORS.gray3, fontSize: 12 }}>
                      Ressource complémentaire pour approfondir
                    </Text>
                  </View>
                  <FontAwesomeIcon icon={faChevronRight} size={24} color={dark ? COLORS.secondaryWhite : COLORS.gray3} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push({
                    pathname: '/Enfants/Historique/Videodetails',
                    params: {
                      resourceId: '1',
                      subject: subjectName
                    }
                  })}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    borderRadius: 8,
                    padding: 12
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPlayCircle}
                    size={24}
                    color={COLORS.primary}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
                      Vidéo explicative - {subjectName}
                    </Text>
                    <Text style={{ color: dark ? COLORS.secondaryWhite : COLORS.gray3, fontSize: 12 }}>
                      10:24 minutes
                    </Text>
                  </View>
                  <FontAwesomeIcon icon={faChevronRight} size={24} color={dark ? COLORS.secondaryWhite : COLORS.gray3} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
        {renderFeedbackModal()}
      </View>
    </SafeAreaView>
  );
};

export default HistoryDetails;