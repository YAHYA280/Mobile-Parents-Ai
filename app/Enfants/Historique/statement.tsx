import React from 'react';
import { View, Text, Image } from 'react-native';

import type { Activity } from '../../../data/Enfants/CHILDREN_DATA';

import icons  from '../../../constants/icons';
import { COLORS } from '../../../constants/theme';

interface StatementProps {
  activity: Activity;
  dark: boolean;
}

const Statement: React.FC<StatementProps> = ({ activity, dark }) => {
  return (
    <View style={{
      padding: 16,
      backgroundColor: dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
      borderBottomWidth: 1,
      borderBottomColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    }}>
      {/* Titre de l&apos;énoncé */}
      <Text style={{
      fontSize: 16,
      fontWeight: 'bold',
      color: dark ? COLORS.white : COLORS.black,
      marginBottom: 12,
      textAlign: 'center'
    }}>
      Énoncé de l&apos;exercice
    </Text>

      {/* Contenu de l&apos;énoncé */}
      <View style={{
        backgroundColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12
      }}>
        <Text style={{
          fontSize: 14,
          lineHeight: 20,
          color: dark ? COLORS.white : COLORS.black,
          marginBottom: 12
        }}>
          Voici l&apos;énoncé détaillé de l&apos;exercice. Vous pouvez remplacer ce texte par le contenu réel de l&apos;énoncé qui se trouve dans vos données.
        </Text>

        <Text style={{
          fontSize: 14,
          lineHeight: 20,
          color: dark ? COLORS.white : COLORS.black,
          marginBottom: 8
        }}>
          1. Lisez attentivement l&apos;ensemble de l&apos;énoncé avant de commencer.
        </Text>

        <Text style={{
          fontSize: 14,
          lineHeight: 20,
          color: dark ? COLORS.white : COLORS.black,
          marginBottom: 8
        }}>
          2. Utilisez les outils fournis pour résoudre le problème.
        </Text>

        <Text style={{
          fontSize: 14,
          lineHeight: 20,
          color: dark ? COLORS.white : COLORS.black,
          marginBottom: 8
        }}>
          3. Vérifiez votre travail avant de le soumettre.
        </Text>

        <Text style={{
          fontSize: 14,
          fontStyle: 'italic',
          color: dark ? COLORS.secondaryWhite : COLORS.gray3,
          marginTop: 12
        }}>
          Cet exercice vise à renforcer vos compétences en résolution de problèmes.
        </Text>
      </View>

      {/* Informations supplémentaires */}
      <View style={{
        backgroundColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        padding: 12,
        borderRadius: 8
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Image 
              source={icons.infoCircle} 
              style={{ 
              width: 14, 
              height: 14, 
              marginRight: 8,
              tintColor: COLORS.primary 
            }} 
          />
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: dark ? COLORS.white : COLORS.black
          }}>
            Détails de l&apos;activité
          </Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
          <Text style={{
            width: 80,
            color: dark ? COLORS.secondaryWhite : COLORS.gray3,
            fontSize: 13
          }}>
            Date:
          </Text>
          <Text style={{
            flex: 1,
            color: dark ? COLORS.white : COLORS.black,
            fontSize: 13
          }}>
            {new Date(activity.date).toLocaleDateString('fr-FR')}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
          <Text style={{
            width: 80,
            color: dark ? COLORS.secondaryWhite : COLORS.gray3,
            fontSize: 13
          }}>
            Assistant:
          </Text>
          <Text style={{
            flex: 1,
            color: dark ? COLORS.white : COLORS.black,
            fontSize: 13
          }}>
            {activity.assistant || "Non spécifié"}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={{
            width: 80,
            color: dark ? COLORS.secondaryWhite : COLORS.gray3,
            fontSize: 13
          }}>
            Durée:
          </Text>
          <Text style={{
            flex: 1,
            color: dark ? COLORS.white : COLORS.black,
            fontSize: 13
          }}>
            {activity.duree || "Non spécifiée"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Statement;