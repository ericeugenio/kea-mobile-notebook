import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default function NoteScreen({navigation, route}) {
    const note = route.params.note;
    
    const [noteHeadline, setNoteHeadline] = useState(note.headline);
    const [noteBody, setNoteBody] = useState(note.body);

    /*******************************************************************
     Screen methods
    *******************************************************************/

    const saveNote = () => {
        if (noteHeadline === '') {
            Alert.alert('Missing headline');
        }
        else {
            navigation.navigate({
                name: 'Notes', 
                params: {
                    note: {
                        id: note.id,
                        headline: noteHeadline,
                        body: noteBody
                    },
                },
                merge: true,
            });
        }
    };

    /*******************************************************************
     Screen view
    *******************************************************************/

    return (
        <SafeAreaView style={styles.appWrapper} >
            {/* Navigation bar */}
            <View style={styles.navWrapper}>
                <Pressable style={styles.navButton} onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon style={styles.navButtonIcon} icon={faChevronLeft} />
                </Pressable>
                <Pressable style={styles.navButton} onPress={saveNote}>
                    <Text style={styles.navButtonIcon}>Save</Text>
                </Pressable>
            </View>
            {/* Note */}
            <View style={styles.noteWrapper}>
                <TextInput 
                    style={styles.noteHeadline}
                    placeholder='Note headline' 
                    value={noteHeadline}
                    onChangeText={setNoteHeadline}
                    maxLength={50}
                />

                <TextInput 
                    style={styles.noteBody}
                    placeholder='Note body' 
                    value={noteBody}
                    onChangeText={setNoteBody}
                    multiline={true}
                />
            </View>
        </SafeAreaView>
    );
}

/*******************************************************************
  Screen styles
*******************************************************************/

const styles = StyleSheet.create({
    appWrapper: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },

    /* Navigation */
    navWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#d1d1d1',
        marginTop: 24,
    },

    navTitle: {
        fontSize: 32,
        fontWeight: 'bold',
    },

    navButton: {
    },

    navButtonIcon: {
        fontSize: 16,
        color: '#006ee6',
    },

    /* Note */
    noteWrapper: {
        height: '100%',
        padding: 24,
        backgroundColor: '#fff',
    },

    noteHeadline: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },

    noteBody: {
        fontSize: 16,
    },
});
