import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import "./Voting.css"; // Import CSS file

const Voting = () => {
    const [votes, setVotes] = useState({
        chandan: 0,
        sandeep: 0,
        lalit: 0,
        manish: 0,
    });

    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        fetchVotes();
        const votedCandidate = localStorage.getItem("votedCandidate");
        if (votedCandidate) {
            setHasVoted(true);
        }
    }, []);

    const fetchVotes = async () => {
        try {
            // const res = await axios.get("http://localhost:5000/api/leaders");https://votebackend-sudu.onrender.com/
            const res = await axios.get("https://votebackend-sudu.onrender.com/api/leaders");
            const voteData = res.data.reduce((acc, leader) => {
                acc[leader.name] = leader.votes;
                return acc;
            }, {});
            setVotes(voteData);
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
    };

    const vote = async (candidate) => {
        if (hasVoted) {
            toast.error("You have already voted!");
            return;
        }

        try {
            await axios.post("https://votebackend-sudu.onrender.com/api/vote", { candidate });
            toast.success(`Vote cast for ${candidate}!`);
            localStorage.setItem("votedCandidate", candidate);
            setHasVoted(true);
            fetchVotes();
        } catch (error) {
            toast.error(error.response?.data?.message || "Voting failed!");
            console.error("Error voting:", error);
        }
    };

    const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

    return (
        <Container className="voting-container text-center">
            <h2 className="fw-bold title">🗳️ Vote for Your Favorite Leader</h2>

            {hasVoted && <p className="alert-msg">✅ You have already voted!</p>}

            <div className="vote-buttons">
                <Button className="vote-btn chandan" onClick={() => vote("chandan")} disabled={hasVoted}>
                    🟦 Chandan ({votes.chandan})
                </Button>
                <Button className="vote-btn sandeep" onClick={() => vote("sandeep")} disabled={hasVoted}>
                    🟩 Sandeep ({votes.sandeep})
                </Button>
                <Button className="vote-btn lalit" onClick={() => vote("lalit")} disabled={hasVoted}>
                    🟥 Lalit ({votes.lalit})
                </Button>
                <Button className="vote-btn manish" onClick={() => vote("manish")} disabled={hasVoted}>
                    🟨 Manish ({votes.manish})
                </Button>
            </div>

            <hr className="divider" />

            <Card className="vote-card">
                <h4 className="fw-bold">📊 Current Vote Count</h4>
                <Row className="mt-3">
                    <Col className="vote-count">🟦 Chandan Singh: {votes.chandan}</Col>
                    <Col className="vote-count">🟩 Sandeep Kumar: {votes.sandeep}</Col>
                    <Col className="vote-count">🟥 Lalit: {votes.lalit}</Col>
                    <Col className="vote-count">🟨 Manish: {votes.manish}</Col>
                </Row>
            </Card>

            <h3 className="fw-bold total-votes">🔥 Total Votes: {totalVotes}</h3>
        </Container>
    );
};

export default Voting;
