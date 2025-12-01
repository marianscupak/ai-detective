import { ChatRoom } from '@/components/chat/chat-room';
import { exampleCase } from '@/fixtures/case';

const InvestigationPage = () => {
	return <ChatRoom caseDetails={exampleCase} />;
};

export default InvestigationPage;
