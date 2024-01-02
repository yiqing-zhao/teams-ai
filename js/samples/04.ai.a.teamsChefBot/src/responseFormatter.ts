import { Application, AI, PredictedSayCommand } from '@microsoft/teams-ai';
import {ApplicationTurnState} from './index';

/**
 *
 * @param app
 */
export function addResponseFormatter(app: Application<ApplicationTurnState>): void {
    app.ai.action<PredictedSayCommand>(AI.SayCommandActionName, async (context, state, data) => {
        // Replace markdown code blocks with <pre> tags
        let addTag = false;
        let inCodeBlock = false;
        const output: string[] = [];
        const response = data.response.split('\n');
        for (const line of response) {
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    // Add tag to start of next line
                    addTag = true;
                    inCodeBlock = true;
                } else {
                    // Add tag to end of previous line
                    output[output.length - 1] += '</pre>';
                    addTag = false;
                    inCodeBlock = false;
                }
            } else if (addTag) {
                output.push(`<pre>${line}`);
                addTag = false;
            } else {
                output.push(line);
            }
        }

        // Send response
        const formattedResponse = output.join('\n');
        if (context.activity.type === "message") {
            if (state.conversation.history.length > 10) {
                state.conversation.history.shift(); // Remove oldest message
            }
            state.conversation.history.push(formattedResponse);
        }
        await context.sendActivity(formattedResponse);

        return '';
    });
}
