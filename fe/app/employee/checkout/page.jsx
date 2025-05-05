"use client";

import { useState, useEffect } from "react";
import { fetchActiveSessions, initiateCheckout, confirmCheckout } from "../../api/employee.client";
import { useToast } from "../../components/providers/ToastProvider";
import PageHeader from "../../components/common/PageHeader";

// Import our new components
import TicketLookup from "../../components/employee/checkout/TicketLookup";
import ActiveSessions from "../../components/employee/checkout/ActiveSessions";
import PaymentDetails from "../../components/employee/checkout/PaymentDetails";
import SuccessScreen from "../../components/employee/checkout/SuccessScreen";

// Import our new components
import TicketLookup from "../../components/employee/checkout/TicketLookup";
import ActiveSessions from "../../components/employee/checkout/ActiveSessions";
import PaymentDetails from "../../components/employee/checkout/PaymentDetails";
import SuccessScreen from "../../components/employee/checkout/SuccessScreen";

export default function CheckOutPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [activeSessions, setActiveSessions] = useState([]);
    const [lotInfo, setLotInfo] = useState({});
    const [checkoutStage, setCheckoutStage] = useState(0); // 0: none, 1: initiated, 2: completed
    const [processingId, setProcessingId] = useState(null);
    const [currentSession, setCurrentSession] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [isLostTicket, setIsLostTicket] = useState(false); // We keep this state but hide the control
    const [manualSessionId, setManualSessionId] = useState("");
    const [lastRefreshed, setLastRefreshed] = useState(Date.now());

    useEffect(() => {
        loadActiveSessions();
    }, [lastRefreshed]); // Re-run when lastRefreshed changes

    const loadActiveSessions = async () => {
        setLoading(true);
        try {
            const data = await fetchActiveSessions();
            setActiveSessions(data.sessions || []);
            setLotInfo({
                lot_id: data.lot_id,
                lot_name: data.lot_name,
                lot_name: data.lot_name,
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load sessions");
            toast.error(error.response?.data?.message || "Failed to load sessions");
        } finally {
            setLoading(false);
        }
    };

    // Function to force a refresh of the sessions data
    const refreshSessions = () => {
        setLastRefreshed(Date.now());
    };

    const handleTicketLookup = async (e) => {
        e.preventDefault();
        if (!manualSessionId) {
            toast.error("Please enter a valid ticket ID");
            return;
        }

        setProcessingId(manualSessionId);
        try {
            await handleInitiateCheckout(manualSessionId);
        } catch (error) {
            toast.error("Failed to find ticket");
        } finally {
            setProcessingId(null);
        }
    };

    const handleInitiateCheckout = async (sessionId) => {
        setProcessingId(sessionId);
        try {
            const result = await initiateCheckout(sessionId, isLostTicket);
            setPaymentDetails(result);
            setCurrentSession(result.session_details);
            setCheckoutStage(1);


            toast.success("Checkout initiated");
        } catch (error) {
            console.error("Checkout initiation error:", error);
            const errorMessage = error.response?.data?.message || "Failed to initiate checkout";
            toast.error(errorMessage);
            throw error;
        } finally {
            setProcessingId(null);
        }
    };

    const handleConfirmPayment = async () => {
        if (!paymentDetails || !currentSession) {
            toast.error("No checkout session to confirm");
            return;
        }

        setLoading(true);
        try {
            const result = await confirmCheckout(currentSession.session_id, paymentMethod, isLostTicket);

            // Update payment details with the actual confirmed payment
            setPaymentDetails(result.payment);
            setCheckoutStage(2);


            // Remove the session from active sessions if it's in the list
            setActiveSessions(activeSessions.filter((session) => session.session_id !== currentSession?.session_id));

            setActiveSessions(activeSessions.filter((session) => session.session_id !== currentSession?.session_id));

            toast.success("Payment confirmed and vehicle checked out");
        } catch (error) {
            console.error("Payment confirmation error:", error);
            const errorMessage = error.response?.data?.message || "Failed to confirm payment";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetCheckout = () => {
        setCheckoutStage(0);
        setCurrentSession(null);
        setPaymentDetails(null);
        setIsLostTicket(false);
        setManualSessionId("");
        refreshSessions(); // Refresh the sessions data when returning to the main screen
    };

    // Refresh on page visibility change (when user navigates back to this page)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible" && checkoutStage === 0) {
            if (document.visibilityState === "visible" && checkoutStage === 0) {
                refreshSessions();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [checkoutStage]);

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Check-Out Vehicle" />


            {checkoutStage === 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                    <div className="lg:col-span-1">
                        <TicketLookup
                            manualSessionId={manualSessionId}
                            setManualSessionId={setManualSessionId}
                            isLostTicket={isLostTicket}
                            setIsLostTicket={setIsLostTicket}
                            loading={loading}
                            lotInfo={lotInfo}
                            refreshSessions={refreshSessions}
                            handleTicketLookup={handleTicketLookup}
                        />
                    </div>

                    <div className="lg:col-span-3">
                        <ActiveSessions
                            activeSessions={activeSessions}
                            loading={loading}
                            handleInitiateCheckout={handleInitiateCheckout}
                            processingId={processingId}
                            formatDateTime={formatDateTime}
                        />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                    <div className="lg:col-span-1">
                        <TicketLookup
                            manualSessionId={manualSessionId}
                            setManualSessionId={setManualSessionId}
                            isLostTicket={isLostTicket}
                            setIsLostTicket={setIsLostTicket}
                            loading={loading}
                            lotInfo={lotInfo}
                            refreshSessions={refreshSessions}
                            handleTicketLookup={handleTicketLookup}
                        />
                    </div>

                    <div className="lg:col-span-3">
                        <ActiveSessions
                            activeSessions={activeSessions}
                            loading={loading}
                            handleInitiateCheckout={handleInitiateCheckout}
                            processingId={processingId}
                            formatDateTime={formatDateTime}
                        />
                    </div>
                </div>
                </div>
            )}


            {checkoutStage === 1 && currentSession && paymentDetails && (
                <PaymentDetails
                    currentSession={currentSession}
                    paymentDetails={paymentDetails}
                    isLostTicket={isLostTicket}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    loading={loading}
                    resetCheckout={resetCheckout}
                    handleConfirmPayment={handleConfirmPayment}
                    formatDateTime={formatDateTime}
                    formatCurrency={formatCurrency}
                />
                <PaymentDetails
                    currentSession={currentSession}
                    paymentDetails={paymentDetails}
                    isLostTicket={isLostTicket}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    loading={loading}
                    resetCheckout={resetCheckout}
                    handleConfirmPayment={handleConfirmPayment}
                    formatDateTime={formatDateTime}
                    formatCurrency={formatCurrency}
                />
            )}


            {checkoutStage === 2 && (
                <SuccessScreen
                    currentSession={currentSession}
                    paymentDetails={paymentDetails}
                    paymentMethod={paymentMethod}
                    resetCheckout={resetCheckout}
                    formatCurrency={formatCurrency}
                />
                <SuccessScreen
                    currentSession={currentSession}
                    paymentDetails={paymentDetails}
                    paymentMethod={paymentMethod}
                    resetCheckout={resetCheckout}
                    formatCurrency={formatCurrency}
                />
            )}
        </div>
    );
}

