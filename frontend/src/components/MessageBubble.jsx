const MessageBubble = ({
    message,
    currentUsername
}) => {

    const isOwnMessage =
        message.username === currentUsername;


    const formattedTime =
        new Date(
            message.createdAt
        ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });


    const getStatusIcon = () => {

        if (!isOwnMessage) {
            return null;
        }

        switch (message.status) {

            case "sent":
                return "✓";

            case "delivered":
                return "✓✓";

            case "read":
                return "✓✓";

            default:
                return "✓";

        }

    };


    return (

        <div
            className={`message-row ${isOwnMessage
                ? "own-message"
                : "other-message"
                }`}
        >

            <div className="message-bubble" >

                {!isOwnMessage && (

                    <div className="message-username">
                        {message.username}
                    </div>

                )}


                <div className="message-text">
                    {message.text}
                </div>
 
                <div className="message-meta">

                    <span className="message-time">
                        {formattedTime}
                    </span>


                    {isOwnMessage && (

                        <span
                            className={`message-status ${message.status
                                }`}
                        >
                            {getStatusIcon()}
                        </span>

                    )}

                </div>

            </div>

        </div>

    );

};


export default MessageBubble;