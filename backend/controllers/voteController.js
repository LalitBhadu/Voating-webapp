import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

const Voting = () => {
    const [votes, setVotes] = useState({
        chandan: 0,
        sandeep: 0,
        lalit: 0,
        manish: 0,
    });

    useEffect(() => {
        fetchVotes();
    }, []);

    // Fetch votes from backend
    const fetchVotes = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/leaders");
            const voteData = res.data.reduce((acc, leader) => {
                acc[leader.name] = leader.votes;
                return acc;
            }, {});
            setVotes(voteData);
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
    };


    // Handle voting
    const vote = async (candidate) => {
        try {
            await axios.post("http://localhost:5000/api/vote", { candidate });
            toast.success(`Vote cast for ${candidate}!`);
            fetchVotes(); // Refresh votes after voting
        } catch (error) {
            toast.error(error.response?.data?.message || "Voting failed!");
            console.error("Error voting:", error);
        }
    };

    // Calculate total votes dynamically
    const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

    return (
        <Container className="mt-5 text-center">
            <h2 className="fw-bold">Vote for Your Favorite Leader</h2>

            <div className="d-flex flex-column align-items-center mt-4">
                <Button variant="primary" className="mb-2 w-50" onClick={() => vote("chandan")}>
                    Vote Chandan ({votes.chandan})
                </Button>
                <Button variant="success" className="mb-2 w-50" onClick={() => vote("sandeep")}>
                    Vote Sandeep ({votes.sandeep})
                </Button>
                <Button variant="danger" className="mb-2 w-50" onClick={() => vote("lalit")}>
                    Vote Lalit ({votes.lalit})
                </Button>
                <Button variant="danger" className="mb-2 w-50" onClick={() => vote("manish")}>
                    Vote Manish ({votes.manish})
                </Button>
            </div>

            <hr className="my-4" />

            <Card className="p-3 shadow-sm">
                <h4 className="fw-bold">Current Vote Count</h4>
                <Row className="mt-3">
                    <Col>Chandan Singh: {votes.chandan}</Col>
                    <Col>Sandeep Kumar: {votes.sandeep}</Col>
                    <Col>Lalit: {votes.lalit}</Col>
                    <Col>Manish: {votes.manish}</Col>

                </Row>
            </Card>

            <h3 className="fw-bold text-primary mt-4">Total Votes: {totalVotes}</h3>
        </Container>
    );
};

export default Voting;
