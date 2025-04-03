import React, { useState, useEffect } from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const VotingPlatform = () => {
    const [votes, setVotes] = useState(() => {
        // ✅ Check localStorage on page load
        const savedVotes = localStorage.getItem("votes");
        return savedVotes ? JSON.parse(savedVotes) : { chandan: 0, politician1: 0, politician2: 0 };
    });

    const [hasVoted, setHasVoted] = useState(sessionStorage.getItem("hasVoted") === "true");

    const cloudName = "dkfcymu6m";
    const uploadPreset = "voting_preset";
    const resourcePublicId = "voting_data";

    useEffect(() => {
        fetchVotesFromCloudinary();
    }, []);

    const fetchVotesFromCloudinary = async () => {
        try {
            const response = await fetch(
                `https://res.cloudinary.com/${cloudName}/raw/upload/${resourcePublicId}.json`
            );

            if (!response.ok) throw new Error("Votes file not found in Cloudinary.");

            const data = await response.json();
            setVotes(data);
            localStorage.setItem("votes", JSON.stringify(data)); // ✅ Save to localStorage
        } catch (error) {
            console.error("Error fetching votes:", error);
            setVotes({ chandan: 0, politician1: 0, politician2: 0 });
        }
    };

    const vote = async (person) => {
        if (hasVoted) {
            alert("Aap already vote de chuke hain!");
            return;
        }

        const updatedVotes = { ...votes, [person]: (votes[person] || 0) + 1 };
        setVotes(updatedVotes);
        localStorage.setItem("votes", JSON.stringify(updatedVotes)); // ✅ Save to localStorage
        setHasVoted(true);
        sessionStorage.setItem("hasVoted", "true");

        await uploadVotesToCloudinary(updatedVotes);
    };

    const uploadVotesToCloudinary = async (votesData) => {
        const blob = new Blob([JSON.stringify(votesData)], { type: "application/json" });
        const formData = new FormData();
        formData.append("file", blob, "voting_data.json");
        formData.append("upload_preset", uploadPreset);
        formData.append("public_id", resourcePublicId);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            console.log("Votes updated successfully!");
        } catch (error) {
            console.error("Error uploading votes:", error);
            alert("Failed to update votes.");
        }
    };

    const totalVotes = votes.chandan + votes.politician1 + votes.politician2;

    return (
        <Container className="mt-5 text-center">
            <h2 className="fw-bold">Vote for Your Favorite Candidate</h2>

            <div className="d-flex flex-column align-items-center mt-4">
                <Button variant="primary" className="mb-2 w-50" onClick={() => vote("chandan")}>
                    Vote Chandan ({votes.chandan})
                </Button>
                <Button variant="success" className="mb-2 w-50" onClick={() => vote("politician1")}>
                    Vote Politician 1 ({votes.politician1})
                </Button>
                <Button variant="danger" className="mb-2 w-50" onClick={() => vote("politician2")}>
                    Vote Politician 2 ({votes.politician2})
                </Button>
            </div>

            <hr className="my-4" />

            <Card className="p-3 shadow-sm">
                <h4 className="fw-bold">Current Vote Count</h4>
                <Row className="mt-3">
                    <Col>Chandan: {votes.chandan}</Col>
                    <Col>Politician 1: {votes.politician1}</Col>
                    <Col>Politician 2: {votes.politician2}</Col>
                </Row>
            </Card>

            <h3 className="fw-bold text-primary mt-4">Total Votes: {totalVotes}</h3>
        </Container>
    );
};

export default VotingPlatform;
