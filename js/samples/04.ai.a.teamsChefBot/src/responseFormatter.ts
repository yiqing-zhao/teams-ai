
import { Application, AI, PredictedSayCommand } from '@microsoft/teams-ai';

/**
 *
 * @param app
 */
export function addResponseFormatter(app: Application): void {
    app.ai.action<PredictedSayCommand>(AI.SayCommandActionName, async (context, state, data) => {
        // Send response
        const formattedResponse = formatResponse(data.response);
        await context.sendActivity(formattedResponse);

        return AI.StopCommandName;
    });
}


// Add a custom response formatter to convert markdown code blocks to <pre> tags
export function formatResponse(s: string) {
    // Replace markdown code blocks with <pre> tags
    let addTag = false;
    let inCodeBlock = false;
    const output: string[] = [];
    const response = s.split('\n');
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
    return output.join('\n')
}