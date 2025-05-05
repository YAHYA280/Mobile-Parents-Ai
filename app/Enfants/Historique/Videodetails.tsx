import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faExpand, 
  faCompress, 
  faArrowLeft 
} from '@fortawesome/free-solid-svg-icons';
import { 
  View, 
  Text, 
  ScrollView, 
  Dimensions, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native';

import { COLORS } from '../../../constants/theme';
import { useTheme } from '../../../theme/ThemeProvider';

// Define an interface for the video resource
interface VideoResource {
  id: number;
  title: string;
  subject: string;
  description: string;
  duration: string;
  videoUrl: string;
  tags: string[];
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
}

// Mock data (in a real app, this would come from a backend)
const VIDEO_RESOURCES: VideoResource[] = [
  {
    id: 1,
    title: 'Introduction aux Fractions',
    subject: 'Mathématiques',
    description: 'Une explication claire et détaillée des fractions pour les débutants.',
    duration: '10:24',
    videoUrl: '', // Replace with actual video URL
    tags: ['Fractions', 'Primaire', 'Mathématiques de base'],
    difficulty: 'Facile'
  },
  // Add more videos as needed
];

const VideoDetails = () => {
  const router = useRouter();
  const { dark, colors } = useTheme();
  const params = useLocalSearchParams();

  // State for video playback and fullscreen
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Find the video resource based on the ID passed in params
  const resourceId = Number(params.resourceId || 1);
  const resource = VIDEO_RESOURCES.find(r => r.id === resourceId) || VIDEO_RESOURCES[0];

  const handleBack = () => {
    router.back();
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const { width: screenWidth } = Dimensions.get('window');
  const videoHeight = isFullScreen ? screenWidth * (16/9) : 250;

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
          Vidéo Explicative
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Placeholder */}
        <View style={{ 
          backgroundColor: '#A9A9A9', // Dark Gray
          height: videoHeight,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Fullscreen Toggle */}
          <TouchableOpacity 
            onPress={toggleFullScreen} 
            style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 5
            }}
          >
            <FontAwesomeIcon 
              icon={isFullScreen ? faCompress : faExpand} 
              size={24} 
              color={COLORS.white} 
            />
          </TouchableOpacity>
        </View>

        {/* Video Details */}
        <View style={{ 
          padding: 16,
          backgroundColor: dark ? COLORS.dark1 : COLORS.white
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: dark ? COLORS.white : COLORS.black,
            marginBottom: 8
          }}>
            {resource.title}
          </Text>
          
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            marginBottom: 8
          }}>
            <Text style={{ 
              color: dark ? COLORS.secondaryWhite : COLORS.gray3 
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
            color: dark ? COLORS.secondaryWhite : COLORS.gray3 
          }}>
            Durée: {resource.duration}
          </Text>
        </View>

        {/* Description */}
        <View style={{ 
          padding: 16,
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          marginTop: 8
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

        {/* Tags */}
        <View style={{ 
          padding: 16,
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          marginTop: 8
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default VideoDetails;