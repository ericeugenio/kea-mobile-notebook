import { useEffect, useState } from 'react';
import { 
    Image, 
    KeyboardAvoidingView, 
    Pressable, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableWithoutFeedback, 
    View 
} from 'react-native';

import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';

import * as ImagePicker from 'expo-image-picker';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons/faEllipsisVertical';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera';
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage';

import { noteDB } from '../api/firebase.db';
import { imageStorage } from '../api/firebase.storage';

export default function NoteScreen({navigation, route}) {
    const note = route.params.note;
    
    const [noteHeadline, setNoteHeadline] = useState(note.headline);
    const [noteBody, setNoteBody] = useState(note.body);
    const [noteImage, setNoteImage] = useState(null);

    /*******************************************************************
     Screen methods
    *******************************************************************/

    const takeImage = async () => {
        const permissions = await ImagePicker.requestCameraPermissionsAsync();
        
        if (permissions.granted) {
            const result = await ImagePicker.launchCameraAsync();

            if (!result.canceled) {
                setNoteImage(result.assets[0].uri);
            }
        }
    };

    const chooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync();
    
        if (!result.canceled) {
            setNoteImage(result.assets[0].uri);
        }
    };

    const deleteImage = async () => {
        if (note.hasImage) {
            imageStorage.delete(note.id);
        }

        setNoteImage(null);
    }

    const saveNote = async () => {
        if (noteHeadline === '') {
            Alert.alert('Missing headline');
        }
        else {
            const newNote = {
                headline: noteHeadline,
                body: noteBody,
                hasImage: noteImage !== null
            }

            /* Update note in firestore */
            if (note.id) {
                newNote.id = note.id
                await noteDB.update(newNote);
            }
            /* Create new note in firestore */
            else {
                const noteId = await noteDB.create(newNote);
                newNote.id = noteId;
            }

            /* If selected upload image to firebase storage */
            if (newNote.hasImage) {
                await imageStorage.upload(noteImage, newNote.id);
            }

            navigation.navigate('Notes');
        }
    };

    const deleteNote = async () => {
        if (note.id) {
            noteDB.delete(note.id);
        }

        navigation.navigate('Notes');
    };

    /*******************************************************************
     Screen lifecycle
    *******************************************************************/

    /* Load data from firestore */
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                if (note.hasImage) {
                    setNoteImage(await imageStorage.download(note.id));
                }
            }
            catch (err) {
                console.log(err);
            }
        });
        
        return unsubscribe;
    }, [navigation]);

    /*******************************************************************
     Screen components
    *******************************************************************/

    const MenuItemDivider = () => {
        return (
            <View style={styles.menuItemDivider} />
        );
    }

    const MenuItem = ({name, icon, isDanger, onPress}) => {
        return (
            <MenuOption
                onSelect={onPress}
                customStyles={{
                    optionWrapper: {
                        width: 200,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 12,
                    }
                }}
            >
                <Text style={(isDanger ? styles.menuItemTextDanger : styles.menuItemText)} >{name}</Text>
                <FontAwesomeIcon icon={icon} color={isDanger ? '#eb3c30' : '#000'} size={18} />
            </MenuOption>
        );
    };

    const MoreOptionsMenu = () => {
        return (
            <Menu>
                <MenuTrigger>
                    <FontAwesomeIcon style={styles.navButtonIcon} icon={faEllipsisVertical} size={20} />
                </MenuTrigger>
                <MenuOptions
                    customStyles={{
                        optionsContainer: {
                            marginTop: 32,
                            borderRadius: 12,
                        }
                    }}    
                >
                    <MenuItem onPress={takeImage} name={'Take Image'} icon={faCamera} />
                    <MenuItemDivider />
                    <MenuItem onPress={chooseImage} name={'Choose Image'} icon={faImage} />
                    <MenuItemDivider />
                    <MenuItem onPress={deleteNote} name={'Delete'} icon={faTrashAlt} isDanger={true} />
                </MenuOptions>
            </Menu>
        );
    };

    const ImageMenu = () => {
        return(
            <Menu
                renderer={renderers.Popover}
                rendererProps={{
                    preferredPlacement: 'bottom',
                    anchorStyle: {
                        width: 0
                    }
                }}
            >
                <MenuTrigger
                    triggerOnLongPress={true}
                    customStyles={{
                        TriggerTouchableComponent: TouchableWithoutFeedback
                    }}
                >
                    <Image style={styles.noteImage} source={{ uri: noteImage }} />
                </MenuTrigger>
                <MenuOptions
                    customStyles={{
                        optionsContainer: {
                            borderRadius: 12,
                        }
                    }}  
                >
                    <MenuItem onPress={deleteImage} name={'Delete'} icon={faTrashAlt} isDanger={true} />
                </MenuOptions>
            </Menu>
        );
    }

    /*******************************************************************
     Screen view
    *******************************************************************/

    return (
        <MenuProvider
            customStyles={{
                backdrop: {
                    backgroundColor: '#000',
                    opacity: 0.3,
                }
            }}
        >
            <SafeAreaView style={styles.appWrapper} >
                {/* Navigation bar */}
                <View style={styles.navWrapper}>
                    <Pressable style={styles.navButton} onPress={() => navigation.goBack()}>
                        <FontAwesomeIcon style={styles.navButtonIcon} icon={faChevronLeft} size={20} />
                    </Pressable>
                    <View style={styles.navSubWrapperRight}>
                        <Pressable style={styles.navButton} onPress={saveNote}>
                            <Text style={styles.navButtonText}>Save</Text>
                        </Pressable>
                        <MoreOptionsMenu />
                    </View>
                </View>
                {/* Note */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                >
                    <ScrollView style={styles.noteScrollWrapper}>
                        <View style={styles.noteWrapper}>
                            <TextInput 
                                style={styles.noteHeadline}
                                placeholder='Note headline' 
                                value={noteHeadline}
                                onChangeText={setNoteHeadline}
                                maxLength={50}
                            />
                            {noteImage && <ImageMenu />}
                            <TextInput 
                                style={styles.noteBody}
                                placeholder='Note body' 
                                value={noteBody}
                                onChangeText={setNoteBody}
                                multiline={true}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </MenuProvider>
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

    navSubWrapperRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    navTitle: {
        fontSize: 32,
        fontWeight: 'bold',
    },

    navButton: {
    },

    navButtonIcon: {
        color: '#006ee6',
    },

    navButtonText: {
        marginRight: 16,
        fontSize: 18,
        color: '#006ee6',
    },

    /* Menu */
    menuItemText: {
        fontSize: 16,
    },

    menuItemTextDanger: {
        fontSize: 16,
        color: '#eb3c30',
    },

    menuItemDivider: {
        backgroundColor: '#d1d1d1',
        height: StyleSheet.hairlineWidth,
    },

    /* Note */
    noteScrollWrapper: {
        backgroundColor: '#fff', 
        height: '100%',
    },

    noteWrapper: {
        padding: 24,
    },

    noteHeadline: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },

    noteImage: {
        width: '100%', 
        height: 500,
        marginBottom: 16,
    },

    noteBody: {
        fontSize: 16,
    },
});
