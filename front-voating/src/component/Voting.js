
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Card, Row, Col, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import "./Voting.css"; // Import CSS file
import chandansingh from "./../assests/chandansingh.png"

const Voting = () => {
    const [votes, setVotes] = useState({
        chandan: 0,
        sandeep: 0,
        lalit: 0,
        manish: 0,
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

        setHasVoted(true); // Disable all buttons immediately
        setSelectedCandidate(candidate); // Highlight the selected candidate

        try {
            await axios.post("https://votebackend-sudu.onrender.com/api/vote", { candidate });
            toast.success(`Vote cast for ${candidate}!`);
            localStorage.setItem("votedCandidate", candidate);
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
                {["chandan", "sandeep", "lalit", "manish"].map((candidate) => (
                    <Button
                        key={candidate}
                        className={`vote-btn ${candidate} ${selectedCandidate === candidate ? "voted" : ""}`}
                        onClick={() => vote(candidate)}
                        disabled={hasVoted}
                    >
                        {selectedCandidate === candidate ? "✅ " : ""} {candidate.toUpperCase()} ({votes[candidate]})
                    </Button>
                ))}
            </div>

            <hr className="divider" />

            <Card className="vote-card">
                <h4 className="fw-bold">📊 Current Vote Count</h4>
                <Row className="mt-3">
                    <Col className="vote-count" style={{margin:"20px"}}><img src={chandansingh} className="poli_image"/> 🟦 Chandan Singh: {votes.chandan}</Col>
                    <Col className="vote-count" style={{margin:"20px"}}><img src={chandansingh} className="poli_image"/> 🟩 Sandeep Kumar: {votes.sandeep}</Col>
                    <Col className="vote-count" style={{margin:"20px"}}><img src={chandansingh} className="poli_image"/> 🟥 Lalit: {votes.lalit}</Col>
                    <Col className="vote-count" style={{margin:"20px"}}><img src={chandansingh} className="poli_image"/> 🟨 Manish: {votes.manish}</Col>
                </Row>
            </Card>
            <h3 className="fw-bold total-votes">🔥 Total Votes: {totalVotes}</h3>
        </Container>
    );
};

export default Voting;
