import { Pressable, StyleSheet, Text } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function Note({note, onPress, onPressDelete}) {
    const [pressX, setPressX] = useState(0);
    const [pressY, setPressY] = useState(0);
    const [background, setBackground] = useState('#fff');

    const backgroundStyle = {
        backgroundColor: background,
    }

    /*******************************************************************
     Component methods
    *******************************************************************/

    const onPressIn = (e) => {
        setBackground('#f9f9f9');
        setPressX(e.nativeEvent.locationX);
        setPressY(e.nativeEvent.locationY);
    }

    const onPressOut = (e) => {
        setBackground('#fff');
        /* Distinguisg between swipe or press */
        if (pressX === e.nativeEvent.locationX && pressY === e.nativeEvent.locationY) {
            onPress();
        }
    }

    const renderRightActions = () => {
        return (
            <Pressable style={styles.noteRightSwipableWrapper} onPress={onPressDelete}>
                <FontAwesomeIcon style={styles.noteRightSwipableIcon} icon={faTrash} />
            </Pressable>
        );
    };

    /*******************************************************************
     Component view
    *******************************************************************/

    return (
        <Swipeable
            friction={2}
            renderRightActions={renderRightActions}
        >
            <Pressable style={[styles.noteWrapper, backgroundStyle]} onPressIn={onPressIn} onPressOut={onPressOut}>
                <Text style={styles.noteTitle}>{note.headline}</Text>
            </Pressable>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    noteWrapper: {
        padding: 24,
        borderBottomWidth: 1,
        borderColor: '#d1d1d1',
    },

    noteTitle: {
        fontSize: 16,
    },

    noteRightSwipableWrapper: {
        alignContent: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#eb3c30',
    },

    noteRightSwipableIcon: {
        color: '#fff',
    },
});