import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import "./Voting.css";
import { API_URL } from './../url.js';

const candidateMap = {
    "chandan singh": "chandan",
    "savitri devi": "savitri",
    "sanjay prasad": "sanjay",
    "sumit kumar": "sumit"
};

const Voting = () => {
    const [votes, setVotes] = useState({
        chandan: 0,
        savitri: 0,
        sanjay: 0,
        sumit: 0,
    });

    const [hasVoted, setHasVoted] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        fetchVotes();
        const votedCandidate = localStorage.getItem("votedCandidate");
        if (votedCandidate) {
            setHasVoted(true);
            setSelectedCandidate(votedCandidate);
        }
    }, []);

    const fetchVotes = async () => {
        try {
            const res = await axios.get(`${API_URL}/leaders`);
            const voteData = res.data.reduce((acc, leader) => {
                acc[leader.name.toLowerCase()] = leader.votes;
                return acc;
            }, {});
            setVotes(voteData);
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
    };

    const vote = async (fullName) => {
        if (hasVoted) {
            toast.error(`You have already voted!`);
            return;
        }

        const shortKey = candidateMap[fullName];
        if (!shortKey) {
            toast.error("Invalid candidate!");
            return;
        }

        setHasVoted(true);
        setSelectedCandidate(fullName);

        try {
            await axios.post(`${API_URL}/vote`, { candidate: shortKey });
            toast.success(`Vote cast for ${fullName}!`);
            localStorage.setItem("votedCandidate", fullName);
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
                {Object.keys(candidateMap).map((candidate) => (
                    <Button
                        key={candidate}
                        className={`vote-btn ${candidate} ${selectedCandidate === candidate ? "voted" : ""}`}
                        onClick={() => vote(candidate)}
                        disabled={hasVoted}
                    >
                        {selectedCandidate === candidate ? "✅ " : ""} {candidate.toUpperCase()} ({votes[candidateMap[candidate]] || 0})
                    </Button>
                ))}
            </div>

            <hr className="divider" />

            <Card className="vote-card">
                <h4 className="fw-bold">📊 Current Vote Count</h4>
                <Row className="mt-3">
                    <Col className="vote-count">🟦 Chandan Singh: {votes.chandan}</Col>
                    <Col className="vote-count">🟩 Savitri Devi: {votes.savitri}</Col>
                    <Col className="vote-count">🟥 Sanjay Prasad: {votes.sanjay}</Col>
                    <Col className="vote-count">🟨 Sumit Kumar: {votes.sumit}</Col>
                </Row>
            </Card>

            <h3 className="fw-bold total-votes">🔥 Total Votes: {totalVotes}</h3>
        </Container>
    );
};

export default Voting;
