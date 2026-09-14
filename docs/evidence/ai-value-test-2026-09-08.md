# AI value test - 2026-09-08

Synthetic explanations only. No child wrote any of this text and nothing here is stored by the game.

- Cases: 39
- Model: not run (no OPENROUTER_API_KEY)
- Default model id: `anthropic/claude-sonnet-5`
- Keyword table agrees with the adult label on 29/39 (74%)
- **Model path untested**: no OPENROUTER_API_KEY was present in the environment.

## Agreement table

| # | group | explanation | expected | keyword |
| --- | --- | --- | --- | --- |
| seed-01 | seed | 0.45 is bigger because 45 is bigger than 8. | L | L |
| seed-02 | seed | It has more numbers after the dot so it's more. | L | L |
| seed-03 | seed | 0.8 only goes to the tenths place, it's basically incomplete, so it's smaller. | L | UNCLEAR |
| seed-04 | seed | 0.45 has hundredths, and hundredths are bigger units than tenths, like how a hundred is bigger than ten. | L | UNCLEAR |
| seed-05 | seed | 0.45 dollars is way more than 0.8 dollars, ask anyone. | MONEY | MONEY |
| seed-06 | seed | idk I just picked one, they looked about the same size on the line | GUESS | GUESS |
| seed-07 | seed | I know 0.8 is bigger than 0.45 really but I clicked the wrong spot by accident, sorry | SLIP | SLIP |
| seed-08 | seed | Because when I zoomed in, 0.45 was further along the line to the right, and right means bigger. | L | L |
| seed-09 | seed | Decimals are dumb, I hate this game | UNCLEAR | UNCLEAR |
| seed-10 | seed | I think 45 hundredths is smaller than 8 tenths but I put it on the wrong side because I read the number line backwards from right to left | SLIP | SLIP |
| para-l-01 | paraphrase | The one with the longer tail is the heavier box. | L | UNCLEAR |
| para-l-02 | paraphrase | Three digits beats one digit so it goes further along. | L | UNCLEAR |
| para-l-03 | paraphrase | more digits means bigger, thats how numbers work | L | L |
| para-l-04 | paraphrase | if you take away the point it is four hundred and fifty versus eight, easy | L | UNCLEAR |
| para-l-05 | paraphrase | It is longer so it is larger. | L | L |
| para-s-01 | paraphrase | More digits after the point means smaller, they are only little crumbs. | S | S |
| para-s-02 | paraphrase | The shorter one is bigger because hundredths are chopped up tiny. | S | S |
| para-s-03 | paraphrase | Longer decimals are smaller, my brother told me. | S | S |
| para-s-04 | paraphrase | When you keep cutting the pieces up you end up with less, so the long one loses. | S | UNCLEAR |
| slip-01 | slip | oops my hand slipped, I meant to put it on the other side | SLIP | SLIP |
| slip-02 | slip | I dropped it too early, that was not where I wanted it. | SLIP | UNCLEAR |
| slip-03 | slip | the mouse jumped and it landed in the wrong place, I know 0.8 wins | SLIP | SLIP |
| money-01 | money | Like money, 45 cents is more than 8 cents so it goes on the right. | MONEY | MONEY |
| money-02 | money | It is like rupees and paise, 45 paise beats 8 paise. | MONEY | MONEY |
| money-03 | money | the price is higher for the long one | MONEY | MONEY |
| mix-01 | code-mixed | 0.45 bada hai kyunki 45 zyada hai 8 se | L | UNCLEAR |
| mix-02 | code-mixed | point ke baad zyada digits hain to wo bigger hoga na | L | UNCLEAR |
| mix-03 | code-mixed | mujhe nahi pata, maine bas guess kar liya | GUESS | GUESS |
| mix-04 | code-mixed | galti se wrong side pe daal diya, sorry | SLIP | SLIP |
| mix-05 | code-mixed | chhota wala bada hota hai kyunki lambe decimals tiny pieces hote hain | S | UNCLEAR |
| off-01 | off-topic | can I play the racing game instead | UNCLEAR | UNCLEAR |
| off-02 | off-topic | my cat is called Biscuit | UNCLEAR | UNCLEAR |
| off-03 | off-topic | (empty) | UNCLEAR | UNCLEAR |
| off-04 | off-topic | ?????? | UNCLEAR | UNCLEAR |
| corr-01 | correction | 8 tenths is bigger than 75 hundredths, I saw it when we zoomed in. | VALID | VALID |
| corr-02 | correction | 0.8 is the same as 0.80 so it lands past 0.75. | VALID | VALID |
| corr-03 | correction | Robo is wrong because the tenths place decides first here. | VALID | VALID |
| corr-04 | correction | I moved it but I do not know why | GUESS | GUESS |
| corr-05 | correction | Robo is right, more digits is more. | L | L |

## Disagreements with the adult label

- `seed-03` expected **L**, keyword **UNCLEAR** - Paraphrase of L that no finite keyword bank contains.
- `seed-04` expected **L**, keyword **UNCLEAR** - Garbled place-value analogy; the table has no rule for it.
- `para-l-01` expected **L**, keyword **UNCLEAR**
- `para-l-02` expected **L**, keyword **UNCLEAR**
- `para-l-04` expected **L**, keyword **UNCLEAR**
- `para-s-04` expected **S**, keyword **UNCLEAR**
- `slip-02` expected **SLIP**, keyword **UNCLEAR**
- `mix-01` expected **L**, keyword **UNCLEAR**
- `mix-02` expected **L**, keyword **UNCLEAR**
- `mix-05` expected **S**, keyword **UNCLEAR**

## Erroneous-example generation through the verifier

Not run: no OPENROUTER_API_KEY. The authored fallback bank was used in its place; every authored example passes the verifier (see `tests/verifier.test.ts`).

## Fallback bank sample

- L: "0.36 is bigger than 0.5. It has two numbers after the point, so it must be worth more."
- S: "0.5 is bigger than 0.75. Fewer digits after the point means bigger, because extra digits are tiny bits."
