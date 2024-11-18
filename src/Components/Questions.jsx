import { useEffect } from "react";
import Question from "./Question";

const questionsData =[
    {
        'id': '1',
        'q': 'How can I report a threat or unsafe situation on the platform?',
        'a': ['To report a threat, simply go to the "Create Post" section, select your country and category, and describe the situation. You can also attach any relevant files like images or videos to help authorities better understand the issue.']
    },
    {
        'id': '2',
        'q': 'Will my identity remain anonymous when I report a threat?',
        'a': ['Yes, your identity will remain anonymous. No personal data such as your name, contact number, or address will be visible to others. Only the country and category of the threat will be visible to the public.']
    },
    {
        'id': '3',
        'q': 'Can I modify or delete my report after submission?',
        'a' : ['No, once a report is posted, it cannot be modified or deleted. This ensures the integrity of the data and helps authorities track all reports accurately.']
    },
    {
        'id': '4',
        'q': 'How do I contact the support team for help?',
        'a': ['If you need assistance or have questions about using the platform, you can contact our support team by emailing us at support@saferwomen.com or call the helpline at 1800-XXXX-XXXX. Our team is available 24/7.']
    },
    {
        'id': '5',
        'q': 'What if I need immediate help? How can I contact the authorities?',
        'a': ['In case of an emergency, always call the following helplines in India:\n- National Women’s Helpline: 1091\n- Women’s Safety App (SOS): 112\n- Police Emergency Number: 100\n- Childline (For minors): 1098']
    }
]

const Questions = () => {
    useEffect(()=>{
        document.title = "FAQs"
    },[])

    return(
        <div className="p-2 py-5">
            <h2 className="text-3xl font-bold my-5 text-center">FAQs</h2>
            <div className="p-5">
                {questionsData.map(qa => <Question question={qa.q} answer={qa.a} key={qa.id} />)}
            </div>
        </div>
    )
}

export default Questions;
