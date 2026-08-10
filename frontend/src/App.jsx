import { useState } from "react";
import Chat from "./pages/Chat";

const App = () => {

    // Get previously saved username
    const [username, setUsername] = useState(() => {
        return localStorage.getItem("chat_username") || "";
    });

    const [submittedUsername, setSubmittedUsername] =
        useState(() => {
            return localStorage.getItem("chat_username") || "";
        });


    const handleSubmit = (event) => {

        event.preventDefault();

        const trimmedUsername =
            username.trim();


        if (!trimmedUsername) {
            return;
        }


        // Save username permanently in browser
        localStorage.setItem(
            "chat_username",
            trimmedUsername
        );


        setSubmittedUsername(
            trimmedUsername
        );

    };


    const handleLogout = () => {

        localStorage.removeItem(
            "chat_username"
        );

        setUsername("");

        setSubmittedUsername("");

    };


    if (!submittedUsername) {

        return (
            <div className="login-page">

                <div className="login-card">

                    <h1>
                        Welcome to Chat
                    </h1>

                    <p>
                        Enter your username to continue.
                    </p>


                    <form
                        onSubmit={handleSubmit}
                    >

                        <input
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(
                                    event.target.value
                                )
                            }
                            placeholder="Enter username"
                            maxLength={30}
                        />


                        <button type="submit">
                            Join Chat
                        </button>

                    </form>

                </div>

            </div>
        );

    }


    return (
        <Chat
            username={submittedUsername}
            onLogout={handleLogout}
        />
    );

};


export default App;