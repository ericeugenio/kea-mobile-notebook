import { useEffect, useState } from 'react';
import { 
    Alert, 
    FlatList, 
    KeyboardAvoidingView, 
    Platform, 
    Pressable, 
    SafeAreaView, 
    StyleSheet, 
    Text, 
    TextInput, 
    View 
} from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';

import Note from '../components/Note';
import { noteDB } from '../api/firebase.db';

export default function NotesScreen({navigation, route}) {
    const [notes, setNotes] = useState([]);
    const [noteHeadline, setNoteHeadline] = useState('');

    /*******************************************************************
     Screen methods
    *******************************************************************/

    const goToNote = (note) => {
        navigation.navigate('Note', {
            note: note
        });
    };

    const goToNewNote = () => {
        if (noteHeadline === '') {
            Alert.alert('Missing headline');
        }
        else {
            navigation.navigate('Note', {
                note: {
                    headline: noteHeadline,
                    body: '',
                    hasImage: false,
                },
            });

            setNoteHeadline('');
        }
    };

    const deleteNote = (noteId) => {
        /* Delte from both db and memory */
        noteDB.delete(noteId);
        setNotes(notes.filter(note => note.id !== noteId));
    }

    const renderNote = ({item}) => {
        return(
            <Note 
                note={item} 
                onPress={() => goToNote(item)}
                onPressDelete={() => deleteNote(item.id)} 
            />
        );
    };

    /*******************************************************************
     Screen lifecycle
    *******************************************************************/

    /* Load data from firestore */
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                setNotes(await noteDB.readAll());
            }
            catch (err) {
                console.log(err);
            }
        });
      
        return unsubscribe;
    }, [navigation]);

    /*******************************************************************
     Screen view
    *******************************************************************/

    return (
        <SafeAreaView style={styles.appWrapper} >
            {/* Navigation bar */}
            <View style={styles.navWrapper}>
                <Text style={styles.navTitle}>Notes</Text>
            </View>
            {/* Notes list */}
            <FlatList
                style={styles.notesWrapper}
                data={notes}
                renderItem={renderNote}
            />
            {/* Input bar */}
            <KeyboardAvoidingView 
                style={styles.inputWrapper}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                keyboardVerticalOffset={12}
            >
                <TextInput 
                    style={styles.inputText}
                    placeholder='New note headline' 
                    value={noteHeadline}
                    onChangeText={setNoteHeadline}
                    maxLength={50}
                />
                <Pressable style={styles.inputButton} onPress={goToNewNote}>
                    <FontAwesomeIcon style={styles.inputButtonIcon} icon={faPlus} size={20} />
                </Pressable>
            </KeyboardAvoidingView>
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
        justifyContent: 'center',
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

    /* Notes list */
    notesWrapper: {
        backgroundColor: '#fff',
    },

    /* Input */
    inputWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: '#d1d1d1',
        marginBottom: 24,
    },

    inputText: {
        width: '85%',
        backgroundColor: '#fff',
        padding: 8,
        borderWidth: 1,
        borderRadius: 24,
        borderColor: '#d1d1d1',
        fontSize: 16,
    },

    inputButton: {
        padding: 8,
        borderRadius: 24,
        backgroundColor: '#006ee6',
    },

    inputButtonIcon: {
        color: '#fff',
    },
});