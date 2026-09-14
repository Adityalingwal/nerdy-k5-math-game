# K-5 Math Game Market Reference Scan

- Date: 2026-09-14
- Status: preliminary product-reference research; not a full competitive audit
- Purpose: preserve the current market findings and turn them into practical
  guidance for the next Nerdy K-5 game decisions.

## Executive takeaway

The project should not invent its game language from zero. Existing products
already demonstrate several distinct patterns:

- Prodigy shows how a fantasy world, quests, battles, collections and visible
  progression can motivate repeated practice.
- SplashLearn shows how short, immediately understandable activities can make
  a broad elementary library approachable.
- DragonBox shows the stronger concept-first pattern: mathematical objects are
  the characters and the manipulation itself develops number sense.
- DreamBox shows how learner actions can drive adaptive sequencing and
  scaffolding through virtual manipulatives and immediate feedback.
- ST Math shows how visual puzzles can embody the mathematical relationship
  directly, including an existing K-5 puzzle about making two sides equal.

For the current Equal-Sign Repair candidate, the strongest reference family is
DragonBox plus ST Math, not a pure Prodigy-style question wrapper. Prodigy's
motivation and SplashLearn's clarity remain useful supporting references.

This does **not** prove that Equal-Sign Repair is the final concept. It shows
that the next review must compare the prototype against known math-first game
patterns and must demonstrate a distinct, necessary AI contribution.

## Why this scan was needed

Earlier work concentrated on misconception evidence, deterministic correctness,
AI necessity and bounded prototypes. It did not first perform a structured
study of current K-5 math-game interaction patterns. That created a risk of:

- reinventing an existing mechanic;
- treating ordinary worksheets with rewards as a new game idea;
- inventing visual language without a reference target;
- adding generative AI where normal adaptive rules are sufficient; and
- evaluating a prototype only against its own brief rather than against the
  quality bar learners already see in the market.

This file corrects that process gap. It is a starting reference, not the final
market report.

## Research method and evidence boundary

### What was inspected

- Current official product pages and official/store descriptions.
- Publicly visible product imagery and screenshots for Prodigy, SplashLearn,
  DragonBox and ST Math.
- Public ST Math playable-sample catalog and its K-5 scope-and-sequence listing.
- Official DreamBox/Discovery Education descriptions.
- The Brave AI-search answer supplied by Aditya was treated as a lead list,
  not as verified evidence.

### What was not completed

- No paid or authenticated learner journey was completed.
- No complete first-person lesson was played inside every product.
- No child usability study was performed.
- No independent verification of efficacy, pricing, ratings or marketing
  numbers was completed in this pass.
- No conclusion was reached about which products use generative AI at runtime.

Official product pages are still marketing material. They verify what each
company claims and exposes publicly; they do not by themselves prove learning
effectiveness or learner preference.

## Product reference notes

### 1. Prodigy Math

Official product page: <https://www.prodigygame.com/main-en/prodigy-math>

#### Verified product facts

- The official page describes Prodigy Math for Grades 1-8.
- Learners explore a fantasy world and answer adaptive math questions to win
  battles and complete quests.
- The visible meta-loop includes daily and seasonal quests, items, rewards,
  world exploration and more than 100 collectible pets.
- The company describes its level selection as an adaptive algorithm.
- Its public page says in-game chat uses a predetermined set of phrases.

#### Product interpretation

Prodigy is primarily a strong **game wrapper around math practice**. The
fantasy world, avatar, battles, pets and rewards create motivation. The math
question is often a gate that powers or resolves a game event rather than the
fantasy mechanic itself being the mathematical model.

#### Useful inspiration

- A clear character identity and world fantasy.
- Short mission goals with visible progress.
- Consequences that happen immediately after an answer.
- Collecting or upgrading as a lightweight reason to replay.
- A safe, bounded communication model rather than open child chat.

#### What not to copy

- Characters, pets, battle presentation, world map, visual assets or exact UI.
- A large RPG, economy, multiplayer layer or content catalog for this hackathon.
- A structure where unrelated rewards overwhelm the learning mechanic.

### 2. SplashLearn

Official/store page reached from the product site:
<https://play.google.com/store/apps/details?id=com.splash.kids.education.learning.games.free.multiplication.reading.math.grade.app.splashmath>

#### Verified product facts

- The store description covers preschool through Grade 5.
- It describes personalized lessons and adaptive practice across math, reading,
  phonics and problem solving.
- The current listing describes a library of more than 4,000 games and
  activities and personalized daily learning plans.
- Public screenshots present many colorful, discrete activity cards rather
  than one continuous world.

#### Product interpretation

SplashLearn is a strong **micro-activity library** reference. Its main strength
for this project is not breadth; it is the immediate legibility of each small
task, kid-sized touch targets, quick feedback and low-friction transition to
the next activity.

#### Useful inspiration

- One obvious goal per screen.
- Large manipulable objects and readable controls.
- Immediate success/error response.
- Short sessions and simple next-step navigation.
- Friendly visual hierarchy for younger learners.

#### What not to copy

- Its characters, activity art, card layouts or exact reward language.
- A broad K-5 content library.
- Cosmetic reskins of ordinary multiple-choice worksheets.
- Parent/teacher platform features that are unnecessary for the single demo
  loop.

### 3. DragonBox Numbers

Official product page: <https://dragonbox.com/products/numbers>

#### Verified product facts

- The official page targets ages 4-8.
- Its number characters, called Nooms, represent the numbers 1-10.
- The company describes them as digital manipulatives inspired by Cuisenaire
  and Montessori rods.
- The app has four activities intended to build number sense through gameplay,
  with an emphasis on understanding, flexibility and fluency rather than fact
  memorization.

#### Product interpretation

DragonBox is the clearest **math-as-the-game-mechanic** reference in this scan.
The learner does not merely answer a detached question to earn a reward. The
objects they touch embody number magnitude and number relationships.

#### Useful inspiration

- Give mathematical quantities physical behavior.
- Let combining, separating or comparing objects reveal the rule.
- Use sound and motion as mathematical feedback, not only decoration.
- Allow discovery before showing formal notation.
- Make the representation reusable across several puzzles.

#### What not to copy

- Nooms, their visual form, sounds, animations or branded activity structure.
- A direct rods-to-characters reskin.

### 4. DreamBox Math

Official product pages:

- <https://www.discoveryeducation.com/solutions/math/dreambox-math/>
- <https://www.dreambox.com/educators>

#### Verified product facts

- Official descriptions cover K-8 math.
- DreamBox describes virtual manipulatives, immediate feedback and strategic
  mathematical thinking.
- It describes continuous formative assessment and adaptive personalization.

#### Product interpretation

DreamBox is the strongest reference here for **adaptation from interaction
evidence**. Its relevant lesson for this project is that the system can learn
from how a learner manipulates a representation, not only from a final
right/wrong answer.

#### Useful inspiration

- Capture action traces such as selected objects, reversals and retries.
- Use those traces to choose an authored scaffold or next problem.
- Preserve mathematical truth in deterministic logic.
- Give feedback that responds to strategy, not only correctness.

#### What not to copy

- Dashboards, placement infrastructure, classroom administration or broad
  curriculum sequencing.
- The claim that an adaptive system automatically requires generative AI.

### 5. ST Math

Official pages:

- <https://www.mindeducation.org/play-games/>
- <https://www.stmath.com/>
- K-5 scope and sequence:
  <https://play.stmath.com/raft/resources/help/dated/stmath_scope_and_sequence_k-5_cc.pdf>

#### Verified product facts

- ST Math describes a visual approach that introduces mathematical ideas
  through puzzles before abstract language and formulas.
- Public samples are organized by grade and expose playable puzzle levels.
- The K-5 scope-and-sequence document lists visual models that progress toward
  symbolic representations.
- Its Kindergarten Math Challenge includes **Tug Boat with Pictures**: learners
  rearrange numbers so that the sums on both sides are the same. The stated
  purpose is addition, subtraction and the concept of equal amounts.
- Other listed mechanics make the mathematics cause visible world changes, for
  example placing boxes to bridge holes or filling two sides to equal heights.

#### Product interpretation

ST Math is the closest reference to the current Equal-Sign Repair territory.
This is valuable because it validates the visual-puzzle pattern, but it also
raises the differentiation bar. A balance/equal-totals puzzle alone is not a
novel product idea.

#### Useful inspiration

- Show the consequence of a mathematical relationship before explaining it.
- Build a visual-to-symbolic progression.
- Let an incorrect construction fail visibly and safely.
- Keep language light at first, then ask the learner to connect the visual
  result to notation.
- Use a recurring character or destination to make puzzle completion matter.

#### What not to copy

- JiJi, ST Math art, exact levels, named mechanics or puzzle layouts.
- The exact Tug Boat implementation.
- A claim that a visually similar puzzle is differentiated merely because it
  uses an LLM.

## Comparative pattern map

| Product | Primary game structure | Adaptation claim | Relationship between game and math | Best lesson for this project |
| --- | --- | --- | --- | --- |
| Prodigy | Fantasy RPG, quests, battles, collection | Adaptive question delivery | Math usually gates game progress | Motivation, character, pacing |
| SplashLearn | Library of short colorful activities | Personalized/adaptive practice | Varies by activity; often direct practice | Clarity and low-friction micro-loops |
| DragonBox | Concept-first manipulation | Not evaluated in this pass | Mathematical objects are the game | Embodied number relationships |
| DreamBox | Adaptive lessons with manipulatives | Continuous formative adaptation | Learner actions inform scaffolding | Strategy-sensitive adaptation |
| ST Math | Visual puzzle progression | Not evaluated as generative AI | Mathematical relationship drives world result | Visual causality and visual-to-symbolic progression |

## AI terminology: what is and is not established

The words `adaptive`, `algorithmic`, `personalized` and `AI-powered` are often
used loosely in product summaries. They should not be treated as synonyms.

- A deterministic item-selection system can be adaptive without using a
  generative model.
- A game can be excellent without runtime AI.
- A generative model is justified only if it handles meaningful variability
  that compact authored rules cannot safely handle.
- The model must not be the source of mathematical truth.

The Brave AI-search response supplied by Aditya named DreamBox, SplashLearn and
Prodigy as AI/gamified options and also mentioned DragonBox, Khan Academy Kids,
Elephant Learning, Moose Math, CK-12, Khanmigo and Photomath. That answer is a
useful candidate list only. Its prices, ratings, efficacy percentages and
claims about which product uses AI have not been accepted as verified facts.

## Guidance for the Nerdy K-5 product

### What to do

1. **Make the mathematical relationship operate the world.** Moving or
   constructing quantities should visibly change balance, movement, access or
   another game state.
2. **Keep one goal visible.** A learner should understand the next action from
   the screen without reading a long explanation.
3. **Use immediate, informative feedback.** Wrong actions should show what
   relationship broke and invite repair, not only display a red mark.
4. **Progress from visual to symbolic.** Establish equal quantities in the
   world, then connect them to `=` and an equation.
5. **Keep rewards subordinate to learning.** Character reactions, progress and
   a small collectible can motivate replay, but should not hide the concept.
6. **Make replay vary the reasoning.** Replaying should change structure or
   misconception branch, not only colors and numbers.
7. **Keep mathematical truth deterministic.** Equation validity, legal moves,
   correct totals and progression gates belong to code and authored data.
8. **Give AI one bounded responsibility.** The strongest current candidate is
   interpreting an action trace plus a short explanation into a closed
   reasoning label, then selecting an authored probe or scaffold with a safe
   `UNCLEAR` fallback.
9. **Evaluate against market references.** Review the prototype for concept
   embodiment, clarity, feedback, replay and motivation rather than only for
   compliance with its build prompt.
10. **Preserve IP distance.** Borrow general patterns, never branded characters,
    art, text, level maps, sounds or a substantially identical implementation.

### What not to do

- Do not build a large RPG, curriculum library, LMS, social system, account
  platform or teacher dashboard for the hackathon.
- Do not call ordinary difficulty selection or rules-based branching
  generative AI.
- Do not use an LLM to decide whether an equation or construction is correct.
- Do not expose a child to unrestricted AI chat.
- Do not send names, voices, faces or other personal learner data to a model.
- Do not copy competitor assets, characters, branded vocabulary or exact
  screen composition.
- Do not add a model call merely to make an existing puzzle sound novel.
- Do not claim effectiveness, novelty or market superiority from this scan.
- Do not optimize around store ratings, review counts, prices or marketing
  statistics until they are independently verified and relevant.

## Implications for Equal-Sign Repair

### Verified current project state

- D-013 authorizes one isolated deterministic Equal-Sign Repair UI slice.
- It uses four simulated interpretation labels and no runtime model call.
- Claude Code is currently building that authorized slice. This research does
  not require interrupting or discarding that work.

### Product hypotheses to test in the completed slice

- Can the learner see that `=` describes the same value on both sides rather
  than meaning “write the answer next”?
- Does the construction itself reveal equality, or is it still a worksheet
  with animation around it?
- Does a wrong construction produce a meaningful visual consequence and a
  repair action?
- Do the four simulated reasoning labels create genuinely different help and
  next actions?
- Does Replay change the reasoning experience enough to justify another round?
- Is the character/world motivation strong without creating a distracting RPG?
- Compared with the ST Math/DragonBox pattern, what is distinctly better or
  newly enabled by the proposed AI interpretation?

### Current AI hypothesis

AI should not design the world, generate mathematical truth or freely tutor the
child. The narrow hypothesis worth testing is:

> Given a deterministic action trace plus a short learner explanation, a
> constrained model may recognize reasoning that compact rules cannot, then
> choose one authored misconception-specific probe or scaffold.

This remains unresolved. The existing D-012 baseline scored 43/45 on a
co-developed synthetic fixture set, and the real-model route has not been run.
Therefore the current evidence neither proves AI value nor proves that AI must
be dropped.

## Next research and design steps

The completed D-013 build should be preserved and reviewed. Do not stop the
current Claude Code run. Before authorizing a later redesign or final concept,
complete these steps:

1. Run a first-person sample of the relevant Prodigy, SplashLearn, DragonBox,
   DreamBox and ST Math flows where access permits.
2. Capture the same observations for each: onboarding, first action, core loop,
   wrong feedback, recovery, reward, replay, adaptation and mobile behavior.
3. Inspect the closest ST Math equality/equal-amounts examples in more detail so
   the project understands both the proven pattern and the originality risk.
4. Compare the finished D-013 prototype against the reference checklist in
   this file.
5. Produce exactly three materially different, reference-grounded game
   directions rather than one arbitrary redesign.
6. Let Aditya select one direction before issuing the next Claude Code build
   prompt.
7. Only after the deterministic game loop is worth keeping, run an independent
   holdout plus real-model AI-value comparison.
8. Before GitHub sharing or submission, audit every dependency and asset,
   preserve build-time AI disclosure, and resolve collaborator rights for any
   human-authored contribution.

## Open questions

- Which exact age/grade should Equal-Sign Repair target?
- Does the current D-013 prototype feel like a game after direct comparison
  with market references?
- Can its core mechanic be distinguished from existing equal-balance/equal-sum
  puzzles without artificial complexity?
- What learner language variation remains after action traces and button-based
  probes are used?
- Does a real model outperform a properly independent deterministic baseline
  enough to justify latency, cost, privacy and failure modes?
- What contribution will Aditya's brother make, and does the competition's
  individual-entry rule require a written assignment of those rights before
  any of that work enters the submission?

## Source list

Accessed 2026-09-14 unless stated otherwise.

1. Prodigy Math official product page:
   <https://www.prodigygame.com/main-en/prodigy-math>
2. SplashLearn app listing reached from the official apps page:
   <https://play.google.com/store/apps/details?id=com.splash.kids.education.learning.games.free.multiplication.reading.math.grade.app.splashmath>
3. DragonBox Numbers official product page:
   <https://dragonbox.com/products/numbers>
4. DreamBox Math by Discovery Education:
   <https://www.discoveryeducation.com/solutions/math/dreambox-math/>
5. DreamBox educator overview:
   <https://www.dreambox.com/educators>
6. ST Math public game samples:
   <https://www.mindeducation.org/play-games/>
7. ST Math program overview: <https://www.stmath.com/>
8. ST Math Common Core K-5 scope and sequence:
   <https://play.stmath.com/raft/resources/help/dated/stmath_scope_and_sequence_k-5_cc.pdf>

## Change-control note

This research file records evidence and guidance; it does not select a final
concept, change D-013, authorize real AI integration, or authorize deployment.
The current Claude Code D-013 build may finish. Any later scope decision should
be recorded in `docs/decision-log.md` after the build and market comparison are
reviewed together.
