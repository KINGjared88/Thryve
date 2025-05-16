const [isSubmitting, setIsSubmitting] = useState(false);

const handleInfoSubmit = async () => {
    if (!name || !email || !phone) {
        alert('Please provide your name, email, and phone.');
        return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    setMessages(prev => [
        ...prev,
        {
            role: 'assistant',
            content: `Thank you, ${name}! We'll email your copy of "The Easy and Fast Way to Delete Hard Inquiries" to ${email}, and text you the download link.`,
        }
    ]);
    setCollectingInfo(false);
    setInfoCollected(true);

    try {
        const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/22909312/27596qv/';
        const response = await fetch(zapierWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone }),
        });

        if (!response.ok) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: "There was an issue processing your request. Please try again later.",
                }
            ]);
        } else {
            console.log('Data sent to Zapier successfully!');
        }
    } catch (error) {
        setMessages(prev => [
            ...prev,
            {
                role: 'assistant',
                content: "There was a connection error. Please try again.",
            }
        ]);
    }
    setIsSubmitting(false);
};
