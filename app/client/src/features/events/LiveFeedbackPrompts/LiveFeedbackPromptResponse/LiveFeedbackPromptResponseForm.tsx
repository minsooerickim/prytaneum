import { useMemo } from 'react';
import type { MutableRefObject } from 'react';
import { Button, TextField, Radio, RadioGroup, Typography, FormControlLabel } from '@mui/material';

import { Form } from '@local/components/Form';
import { FormTitle } from '@local/components/FormTitle';
import { FormContent } from '@local/components/FormContent';
import { FormActions } from '@local/components/FormActions';
import { useForm } from '@local/core';
import Grid from '@mui/material/Grid';
import { Prompt } from '../useLiveFeedbackPrompt';
import { FEEDBACK_PROMPT_RESPONSE_MAX_LENGTH } from '../../../../utils/rules';

export type TLiveFeedbackPromptResponseFormState = { response: string; vote: string; promptId: string };

export interface LiveFeedbackPromptResponseFormProps {
    onSubmit?: (state: TLiveFeedbackPromptResponseFormState) => void;
    onCancel?: () => void;
    promptRef: MutableRefObject<Prompt>;
}

export function LiveFeedbackPromptResponseForm({ onSubmit, onCancel, promptRef }: LiveFeedbackPromptResponseFormProps) {
    // form related hooks
    const [form, errors, handleSubmit, handleChange] = useForm({
        response: '',
        vote: '',
        promptId: promptRef.current.id,
    });

    const isFeedbackValid = useMemo(() => form.response.trim().length !== 0, [form]);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormTitle title='Feedback Response' />
            <FormContent>
                <Grid container>
                    <Grid item xs>
                        <Typography style={{ overflowWrap: 'break-word' }}>{promptRef.current.prompt}</Typography>
                    </Grid>
                </Grid>
                {promptRef.current.isVote && (
                    <Grid container alignItems='center' justifyContent='space-around'>
                        <RadioGroup
                            row
                            aria-label='feedback-prompt-vote'
                            name='feedback-prompt-vote'
                            value={form.vote}
                            onChange={handleChange('vote')}
                        >
                            <FormControlLabel value='FOR' control={<Radio />} label='For' />
                            <FormControlLabel value='AGAINST' control={<Radio />} label='Against' />
                            <FormControlLabel value='CONFLICTED' control={<Radio />} label='Conflicted' />
                        </RadioGroup>
                    </Grid>
                )}
                <TextField
                    id='feedback-prompt-response-field'
                    name='feedback-prompt-response'
                    label={
                        promptRef.current.isOpenEnded ? 'Write your response here...' : 'Write your reasoning here...'
                    }
                    autoFocus
                    error={Boolean(errors.response)}
                    helperText={errors.response}
                    required
                    multiline
                    value={form.response}
                    onChange={handleChange('response')}
                />
                <Typography
                    variant='caption'
                    color={form.response.length > FEEDBACK_PROMPT_RESPONSE_MAX_LENGTH ? 'red' : 'black'}
                    sx={{ display: 'block', textAlign: 'right' }}
                >
                    {form.response.length}/500
                </Typography>
            </FormContent>
            <FormActions disableGrow gridProps={{ justifyContent: 'flex-end' }}>
                {onCancel && (
                    <Button color='primary' onClick={onCancel}>
                        I wish not to answer
                    </Button>
                )}
                <Button disabled={!isFeedbackValid} type='submit' variant='contained' color='primary'>
                    Submit
                </Button>
            </FormActions>
        </Form>
    );
}