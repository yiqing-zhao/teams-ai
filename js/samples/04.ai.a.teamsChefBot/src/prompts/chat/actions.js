[
    {
        "name": "AnswerQuery",
        "description": "Answers the user query with the given answer and links relevants urls if possible",
        "parameters": {
            "type": "object",
            "properties": {
                "response": {
                    "type": "string",
                    "description": "The amount of time to delay in milliseconds"
                },
                "urls": {
                    "type": "array",
                    "description": "The url links to the sources of the answer",
                }
            },
            "required": [
                "response",
            ]
        }
    }
]