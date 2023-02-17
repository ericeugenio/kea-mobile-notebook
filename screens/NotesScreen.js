import { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Note from '../components/Note';

const defaultNotes = [
    {
        id: 0,
        headline: 'My First Note',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in tortor nec mauris finibus tincidunt sed vitae felis. Curabitur ornare purus ut mi pellentesque, at tincidunt risus euismod. Etiam id posuere metus. Nullam et laoreet metus. Nulla condimentum purus sit amet ullamcorper auctor. Nam eget risus lectus. Integer malesuada bibendum mauris tristique volutpat. Duis vitae placerat nisl. Nam sit amet ligula odio. Quisque a leo non sapien commodo porttitor. Nullam tempus id ipsum vitae tristique. Quisque eget laoreet massa, sit amet tristique odio. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas id tincidunt tellus. Morbi sit amet nulla velit.',
    },
    {
        id: 1,
        headline: 'React Native Intro',
        body: 'Maecenas arcu massa, suscipit id massa a, tempus consequat eros. Quisque venenatis congue ex bibendum fermentum. Phasellus ligula quam, tincidunt a justo id, feugiat consectetur erat. Aliquam blandit quam ipsum, id blandit velit blandit id. Fusce sagittis egestas luctus. Aliquam nec libero faucibus, aliquet velit vitae, luctus felis. Praesent aliquet consectetur mi sit amet pulvinar. Mauris vitae felis tempor metus ornare aliquet. Cras nulla lectus, consequat commodo diam in, finibus dignissim urna. Phasellus purus justo, varius non commodo quis, vulputate eget enim.',
    },
    {
        id: 2,
        headline: 'KEA Guidelines',
        body: 'Nam tempus, ante in bibendum cursus, arcu justo placerat neque, mattis iaculis dolor ipsum ac magna. Sed luctus, ipsum congue feugiat hendrerit, massa ipsum cursus massa, at ullamcorper sem metus non nulla. Cras molestie dictum dictum. Pellentesque egestas interdum suscipit. Duis quis nisi sit amet ligula porta bibendum. In pretium sapien sit amet magna lobortis aliquet. Vivamus odio nibh, scelerisque tristique augue et, congue congue metus. In pulvinar efficitur ultrices. Nunc non leo enim. Fusce vulputate porta tristique. Quisque scelerisque justo enim, at sollicitudin massa tincidunt vel. In hac habitasse platea dictumst. Aliquam volutpat ipsum metus. Mauris sodales felis nulla, et sollicitudin nunc hendrerit et. Duis id ante volutpat, tempus lacus ut, sagittis velit.',
    },
    {
        id: 3,
        headline: 'Example',
        body: 'In quis malesuada mauris. Phasellus mi odio, facilisis vitae viverra eget, luctus at turpis. Vestibulum lacinia eros diam, a accumsan nisi laoreet eu. Aenean venenatis eleifend ligula et efficitur. Vestibulum semper nec justo at sodales. Aliquam eget odio velit. Sed gravida dui nunc, sit amet faucibus enim accumsan vel.',
    },
]

export default function NotesScreen({navigation, route}) {
    const [notes, setNotes] = useState(defaultNotes);
    const [noteId, setNoteId] = useState(defaultNotes.length);
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
                    id: noteId,
                    headline: noteHeadline,
                },
            });

            setNoteHeadline('');
        }
    };

    const createNote = (note) => {
        setNotes([...notes, note]);
        setNoteId(noteId + 1);
    };

    const updateNote = (noteIndex, updatedNote) => {
        setNotes(notes.map((note, index) => {
            if (noteIndex === index) {
                return updatedNote;
            }
            else {
                return note;
            }
        }));
    };

    const deleteNote = (noteId) => {
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

    useEffect(() => {
        if (route.params?.note) {
            const newNote = route.params.note;
            const noteIndex = notes.findIndex(note => note.id === newNote.id);
            
            if (noteIndex >= 0) {
                updateNote(noteIndex, newNote);
            }
            else {
                createNote(newNote);
            }
        }
    }, [route.params?.note]);

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
                    <FontAwesomeIcon style={styles.inputButtonIcon} icon={faPlus} />
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
        padding: 12,
        borderRadius: 24,
        backgroundColor: '#006ee6',
    },

    inputButtonIcon: {
        color: '#fff',
    },
});