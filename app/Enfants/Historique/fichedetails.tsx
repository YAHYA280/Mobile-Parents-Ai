import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faFilePdf, 
  faArrowLeft 
} from '@fortawesome/free-solid-svg-icons';
import { 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native';

import { COLORS } from '../../../constants/theme';
import { useTheme } from '../../../theme/ThemeProvider';

// Define an interface for the pedagogical resource
interface PedagogicalResource {
  id: number;
  title: string;
  subject: string;
  description: string;
  content: string[];
  tags: string[];
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  duration: string;
}

// Mock data (in a real app, this would come from a backend)
const PEDAGOGICAL_RESOURCES: PedagogicalResource[] = [
  {
    id: 1,
    title: 'Introduction aux Fractions',
    subject: 'Mathématiques',
    description: 'Comprendre les bases des fractions et leurs applications',
    content: [
      'Définition d\'une fraction',
      'Représentation graphique',
      'Comparaison de fractions',
      'Opérations de base'
    ],
    tags: ['Fractions', 'Primaire', 'Mathématiques de base'],
    difficulty: 'Facile',
    duration: '30 minutes'
  },
  // Add more resources as needed
];

const FicheDetails = () => {
  const router = useRouter();
  const { dark, colors } = useTheme();
  const params = useLocalSearchParams();
  
  // Find the resource based on the ID passed in params
  const resourceId = Number(params.resourceId || 1);
  const resource = PEDAGOGICAL_RESOURCES.find(r => r.id === resourceId) || PEDAGOGICAL_RESOURCES[0];

  const handleBack = () => {
    router.back();
  };

  const handleDownloadPDF = () => {
    // Implement PDF download logic
    // This would typically involve calling an API or using a PDF generation library
    console.log('Downloading PDF for resource:', resourceId);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
      }}>
        <TouchableOpacity onPress={handleBack} style={{ marginRight: 16 }}>
          <FontAwesomeIcon 
            icon={faArrowLeft} 
            size={24} 
            color={dark ? COLORS.white : COLORS.black} 
          />
        </TouchableOpacity>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: dark ? COLORS.white : COLORS.black
        }}>
          Fiche Pédagogique
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1, padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Resource Title */}
        <View style={{ 
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: dark ? COLORS.white : COLORS.black,
            marginBottom: 8
          }}>
            {resource.title}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ 
              color: dark ? COLORS.secondaryWhite : COLORS.gray3,
              marginBottom: 8
            }}>
              {resource.subject}
            </Text>
            <Text style={{ 
              color: dark ? COLORS.secondaryWhite : COLORS.gray3,
              fontWeight: 'bold'
            }}>
              Niveau: {resource.difficulty}
            </Text>
          </View>
          <Text style={{ 
            color: dark ? COLORS.secondaryWhite : COLORS.gray3,
            marginTop: 8
          }}>
            Durée: {resource.duration}
          </Text>
        </View>

        {/* Description */}
        <View style={{ 
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: dark ? COLORS.white : COLORS.black,
            marginBottom: 8
          }}>
            Description
          </Text>
          <Text style={{ 
            color: dark ? COLORS.secondaryWhite : COLORS.gray3 
          }}>
            {resource.description}
          </Text>
        </View>

        {/* Content */}
        <View style={{ 
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: dark ? COLORS.white : COLORS.black,
            marginBottom: 8
          }}>
            Contenu
          </Text>
          {resource.content.map((item, index) => (
            <View 
              key={index} 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                marginBottom: 8
              }}
            >
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: COLORS.primary,
                marginRight: 8
              }} />
              <Text style={{ 
                color: dark ? COLORS.secondaryWhite : COLORS.gray3,
                flex: 1
              }}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* Tags */}
        <View style={{ 
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: dark ? COLORS.white : COLORS.black,
            marginBottom: 8
          }}>
            Mots-clés
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {resource.tags.map((tag, index) => (
              <View 
                key={index}
                style={{
                  backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  margin: 4
                }}
              >
                <Text style={{ 
                  color: dark ? COLORS.secondaryWhite : COLORS.gray3,
                  fontSize: 12
                }}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Download PDF Button */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center',
          marginBottom: 16
        }}>
          <TouchableOpacity 
            onPress={handleDownloadPDF}
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.primary,
              padding: 14,
              borderRadius: 8
            }}
          >
            <FontAwesomeIcon 
              icon={faFilePdf} 
              size={20} 
              color={COLORS.white} 
            />
            <Text style={{ 
              marginLeft: 8, 
              color: COLORS.white,
              fontWeight: '600'
            }}>
              Télécharger en PDF
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FicheDetails;