import React, { useState, useRef, useEffect } from 'react';
import { TextInput, View, StyleSheet, PanResponder, Text } from 'react-native';
import { Controller } from 'react-hook-form';
import Label from './Label';
import CustomDivider from './Divider';

const TextArea = ({ 
    control,
    name,
    placeholder,
    keyboardType,
    secureTextEntry,
    currency,
    required,
    divider,
    title,
    editable,
    values,
    showBorder,
    style,
    onInputChange}) => {
    const [text, setText] = useState('');
    const [containerHeight, setContainerHeight] = useState(100);
    const [inputHeight, setInputHeight] = useState(100);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (isResizing) {
            containerRef.current.setNativeProps({ style: { opacity: 0.5 } });
        } else {
            containerRef.current.setNativeProps({ style: { opacity: 1 } });
        }
    }, [isResizing]);

    const handleContentSizeChange = (event) => {
        setInputHeight(event.nativeEvent.contentSize.height);
    };

    const handleLayout = (event) => {
        setContainerHeight(event.nativeEvent.layout.height);
    };

    const handlePanResponderMove = (evt, gestureState) => {
        const newHeight = containerHeight + gestureState.dy;
        if (newHeight > 0) {
            setInputHeight(newHeight);
        }
    };

    const handlePanResponderRelease = () => {
        setIsResizing(false);
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          // Only respond to touch events that are not directly on the TextInput component
          return gestureState.dx !== 0 || gestureState.dy !== 0;
        },
        onPanResponderMove: handlePanResponderMove,
        onPanResponderRelease: handlePanResponderRelease,
      });
      
      const borderShow = showBorder === undefined ? true : showBorder


    return (
        <Controller
            control={control}
            name={name}
            rules={required ? { required: `Enter ${placeholder}` } : ""}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                    <View style={{ flexDirection: 'row' }}>
                        {title && <Label text={title} bold={true} />}
                        {title && required && <Text style={{ color: 'red', paddingHorizontal: 3 }}>*</Text>}
                    </View>
                    <View
                        style={[
                            styles.container,
                            { borderColor: error && 'red', borderWidth: currency ? 0 : borderShow ? 1 : 0 },
                        ]}>
                             <TextInput
                                value={value || values}
                                onBlur={onBlur}
                                editable={editable && true}
                                placeholder={placeholder || title}
                                style={[style ? style : styles.input]}        
                                secureTextEntry={secureTextEntry}
                                keyboardType={keyboardType}
                                onChangeText={(e) => {
                                    onChange(e);
                                    onInputChange && onInputChange(e);
                                }}
                                multiline={true}
                                textAlignVertical={'top'}
                                onContentSizeChange={handleContentSizeChange}
                                maxLength={1000}
                                underlineColorAndroid={'transparent'}
                            />
                            {divider && (
                                <CustomDivider />
                            )}
                        <View
                            ref={containerRef}
                            onLayout={handleLayout}
                            style={[styles.container, { height: inputHeight }]}
                            {...panResponder.panHandlers}
                        >
                           
                        </View>
                    </View>
                    {error && (
                        <Text style={{ color: 'red', alignSelf: 'stretch' }}>{`Enter ${placeholder ? placeholder : title}`}</Text>
                    )}
                </>
            )}
        />

    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: 'gray',
        borderRadius: 8,

    },
    input: {
        fontSize: 16,
        minHeight:50,
        paddingLeft: 10
    },
});

export default TextArea;