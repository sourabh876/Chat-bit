const ChatHeader = ({
    username,
    connected,
    onLogout
}) => {

    return (

        <header className="chat-header">

            <div>

                <h1>
                    Real-Time Chat
                </h1>

                <p>
                    Logged in as{" "}
                    <strong>
                        {username}
                    </strong>
                </p>

            </div>


            <div className="connection-status">

                <span
                    className={`status-dot ${connected
                        ? "online"
                        : "offline"
                        }`}
                >

                </span>


                {connected
                    ? "Connected"
                    : "Disconnected"}


                    

                <button
                    type="button"
                    className="logout-button"
                    onClick={onLogout}
                >
                    Logout
                </button>

            </div>



        </header>

    );

};

export default ChatHeader;