import { StyleSheet } from "react-native";

import { COLORS } from "../constants/theme";

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    headerIcon: {
      height: 24,
      width: 24,
    },
    chatContainer: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    inputContainer: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: 'rgba(0, 0, 0, 0.1)',
      alignItems: 'center',
    },
    inputMessageContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#F5F5F5',
      paddingVertical: 8,
      marginRight: 12,
      borderRadius: 24,
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    attachmentIconContainer: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      paddingHorizontal: 10,
    },
    sendButton: {
      height: 40,
      width: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.primary,
    }
  });

export default styles ;