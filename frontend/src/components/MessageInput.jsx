import { useState } from "react";

const MessageInput = ({
    onSendMessage,
    onTyping
}) => {

    const [text, setText] = useState("");


    const handleSubmit = (event) => {

        event.preventDefault();

        const trimmedText =
            text.trim();


        if (!trimmedText) {
            return;
        }


        onSendMessage(
            trimmedText
        );


        setText("");

    };


    const handleChange = (event) => {

        const value =
            event.target.value;

        setText(value);


        if (value.trim()) {

            onTyping();

        }

    };


    return (

        <form
            className="message-input-container"
            onSubmit={handleSubmit}
        >

            <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Type a message..."
                maxLength={1000}
            />


            <button type="submit">
                Send
            </button>

        </form>

    );

};

export default MessageInput;