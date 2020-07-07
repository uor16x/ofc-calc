/**
 * Initial lists && helpers
 */
const cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const suits = ['h', 'd', 'c', 's'];
const suitsFullNames = ['hearts', 'diamonds', 'clubs', 'spades'];
const combinations = [
    'kicker',
    'pair',
    'two-pairs',
    'three-of-a-kind',
    'straight',
    'flush',
    'full-house',
    'four-of-a-kind',
    'straight-flush',
    'royal-flush'
];
const combinationChecker = {
    pairs: data => {
        const pairsIndicies = data.values.reduce((acc, item, index) => {
            if (item > 1) {
                acc.push(index);
            }
            return acc;
        }, []);
        if (pairsIndicies.length === 0) {
            return false;
        }
        if (pairsIndicies.length === 1) {
            if (data.values[pairsIndicies[0]] === 2) {
                return {
                    combination: combinations.indexOf('pair'),
                    value: +pairsIndicies[0],
                    label: `Pair of ${cards[pairsIndicies[0]]}s`
                };
            }
            if (data.values[pairsIndicies[0]] === 3) {
                return {
                    combination: combinations.indexOf('three-of-a-kind'),
                    value: +pairsIndicies[0],
                    label: `Three of a kind of ${cards[pairsIndicies[0]]}s`
                };
            }
            if (data.values[pairsIndicies[0]] === 4) {
                return {
                    combination: combinations.indexOf('four-of-a-kind'),
                    value: +pairsIndicies[0],
                    label: `Four of a kind of ${cards[pairsIndicies[0]]}s`
                };
            }
        }
        if (pairsIndicies.length === 2) {
            if (pairsIndicies.filter(i => data.values[i] === 2).length === pairsIndicies.length) {
                return {
                    combination: combinations.indexOf('two-pairs'),
                    value: Math.max(...pairsIndicies),
                    label: `Two pairs of ${cards[pairsIndicies[0]]}s and ${cards[pairsIndicies[1]]}s`
                };
            } else {
                const triplePart = pairsIndicies.findIndex(p => data.values[p] === 3);
                const doublePart = pairsIndicies.findIndex(p => data.values[p] === 2);
                return {
                    combination: combinations.indexOf('full-house'),
                    value: +`${(pairsIndicies[triplePart].toString()).repeat(3)}${(pairsIndicies[doublePart].toString()).repeat(2)}`,
                    label: `Full house of ${cards[pairsIndicies[triplePart]]}s and ${cards[pairsIndicies[doublePart]]}s`
                };
            }
        }
    },
    sequence: data =>  {
        const matchValuesIndicies = data.values.reduce((acc, item, index) => {
            if (item > 0) {
                acc.push(index);
            }
            return acc;
        }, []);

        const isStraight = combinationChecker.straight(matchValuesIndicies);
        const isWheel = (wheel.filter(wheelCard => matchValuesIndicies.indexOf(wheelCard) > -1)).length === 5;
        const flushSuit = data.suits.findIndex(s => s === 5);
        const highCard = isWheel
            ? 3
            : matchValuesIndicies[matchValuesIndicies.length - 1];

        if (flushSuit !== -1) {
            const combination = combinations.indexOf(
                isStraight
                    ? ((highCard === cards.length - 1) ? 'royal-flush' : 'straight-flush')
                    : 'flush'
            );
            let label = '';
            switch (combination) {
                case combinations.indexOf('flush'):
                    label = `Flush of ${suitsFullNames[flushSuit]}, high card: ${cards[highCard]}`;
                    break;
                case combinations.indexOf('straight-flush'):
                    label = `Straight Flush of ${suitsFullNames[flushSuit]}, high card: ${cards[highCard]}`;
                    break;
                case combinations.indexOf('royal-flush'):
                    label = `Royal Flush of ${suitsFullNames[flushSuit]}`;
                    break;
            }
            return {
                combination,
                value: +highCard,
                label
            };
        }
        if (isStraight || isWheel) {
            return {
                combination: combinations.indexOf('straight'),
                value: +highCard,
                label: `Straight, high card: ${cards[highCard]}`
            }
        }
    },
    straight: valuesIndicies => {
        let isStraight = true;
        for (let i = 0; i < valuesIndicies.length; i++) {
            if (valuesIndicies[i+1]) {
                if (Math.abs(valuesIndicies[i] - valuesIndicies[i+1]) !== 1) {
                    isStraight = false;
                    break;
                }
            }
        }
        return isStraight;
    }
};
const wheel = [0, 1, 2, 3, 12];

const calculationsSequence = [
    [0, 1],
    [1, 2],
    [0, 2]
];
const middleLineBonuses = [0, 0, 0, 2, 4, 8, 12, 20, 30, 50];
const lineBonusesGetters = [
    [
        value => 0,
        value => value - 3,
        value => 0,
        value => value + 10
    ],
    middleLineBonuses.map(value => (() => value)),
    middleLineBonuses.map(points => points > 2 ? points / 2 : 0).map(value => (() => value))
];
const bonusPoints = combinations.map((cName, combination) =>
    ((line, value) => lineBonusesGetters[line][combination](value)));

/**
 * Test data
 */
const testData1 = {
    player1: [
        ['Ah', 'Ad', 'Ac'],
        ['5h', '4s', '3c', '2d', 'As'],
        ['8h', '9h', 'Th', '5h', '3h']
    ],
    player2: [
        ['Qh', 'Qd', '6c'],
        ['5h', '4s', '3c', '2d', 'As'],
        ['8h', '8c', '8d', 'Kc', 'Ks']
    ],
    player3: [
        ['Qh', 'Qd', '6c'],
        ['5h', '4s', '3c', '2d', 'As'],
        ['8h', '8c', '8d', 'Kc', 'Ks']
    ],
};

const testData2 = {
    player1: [
        ['6c', '2c', '4h'],
        ['Jd', '7d', '3d', '8d', 'Qd'],
        ['5c', '5h', '7s', '7h', '7c']
    ],
    player2: [
        ['As', 'Ac', '2h'],
        ['Qc', 'Kd', 'Ad', 'Jh', 'Td'],
        ['8s', '6s', '9s', 'Js', 'Qs']
    ],
    player3: [
        ['Th', 'Ks', 'Qh'],
        ['4c', '5d', '3s', '4s', '5s'],
        ['3h', '2d', '6d', '4d', '3c']
    ]
};

function calculateGame(data) {
    const players = Object.keys(data);
    const results = players.reduce((acc, item) => {
        acc[item] = {
            lines: [0, 0, 0].map(() => ({ line: 0, bonus: 0, total: 0 })),
            total: 0
        };
        return acc;
    }, {});
    calculationsSequence.forEach((sequence, sequenceIndex) => {
        console.log('=========')
        const [ keyPlayer1, keyPlayer2 ] = [ players[sequence[0]], players[sequence[1]] ];
        const linesWonInSequence = [ players[sequence[0]], players[sequence[1]] ].reduce((acc, item) => {
            acc[item] = 0;
            return acc;
        }, {});
        console.log(`Sequence #${sequenceIndex + 1}(<${keyPlayer1}> vs <${keyPlayer2}>)`);
        const [ player1Data, player2Data ] = [ data[keyPlayer1] || ({ scoop: true }), data[keyPlayer2] || ({ scoop: true }) ];
        if (player1Data.scoop && player2Data.scoop) {
            console.log(`Both scooped. Sequence done`)
        } else {
            for (let line = 0; line <= 2; line++) {
                console.log(`Processing line #${line + 1}`)
                let skipLineCalcs = false;
                if (player1Data.scoop) {
                    [results[keyPlayer2].lines, results[keyPlayer1].lines] = lineWon(results[keyPlayer2], results[keyPlayer1], line);
                    linesWonInSequence[keyPlayer2]++;
                    skipLineCalcs = true;
                    console.log(`${keyPlayer1} scooped.`)
                }
                if (player2Data.scoop) {
                    [results[keyPlayer1].lines, results[keyPlayer2].lines] = lineWon(results[keyPlayer1], results[keyPlayer2], line);
                    linesWonInSequence[keyPlayer1]++;
                    skipLineCalcs = true;
                    console.log(`${keyPlayer2} scooped.`)
                }

                const [ player1CurrentLine, player2CurrentLine] = [ player1Data.lines[line], player2Data.lines[line] ];
                if (!skipLineCalcs) {
                    console.log(`<${player1CurrentLine.label}> vs <${player2CurrentLine.label}>`);
                    const comparedLines = compareLines(player1CurrentLine, player2CurrentLine);
                    if (comparedLines === 1) {
                        console.log(`${keyPlayer1} with ${player1CurrentLine.label} won; +1`)
                        const lineWonResult = lineWon(results[keyPlayer1], results[keyPlayer2], line);
                        linesWonInSequence[keyPlayer1]++;
                        [results[keyPlayer1].lines, results[keyPlayer2].lines] = lineWonResult
                    }
                    if (comparedLines === -1) {
                        console.log(`${keyPlayer2} with ${player2CurrentLine.label} won; +1`)
                        const lineWonResult = lineWon(results[keyPlayer2], results[keyPlayer1], line);
                        linesWonInSequence[keyPlayer2]++;
                        [results[keyPlayer2].lines, results[keyPlayer1].lines] = lineWonResult;
                    }
                    if (comparedLines === 0) {
                        console.log(`Lines are totally equal.`)
                    }
                }
                const [player1LineBonus, player2LineBonus] = lineBonuses(
                    player1Data.scoop ? null : player1CurrentLine,
                    player2Data.scoop ? null : player2CurrentLine,
                    line
                );
                console.log(`${keyPlayer1} bonus is ${player1LineBonus} (${player1CurrentLine.label}, scoop: ${player1Data.scoop})`);
                console.log(`${keyPlayer2} bonus is ${player2LineBonus} (${player2CurrentLine.label}, scoop: ${player2Data.scoop})`);
                results[keyPlayer1].lines[line].bonus += player1LineBonus;
                results[keyPlayer2].lines[line].bonus += player2LineBonus;
                console.log(`Line #${line + 1} done.`);
                results[keyPlayer1].lines[line].total = results[keyPlayer1].lines[line].line + results[keyPlayer1].lines[line].bonus;
                results[keyPlayer2].lines[line].total = results[keyPlayer2].lines[line].line + results[keyPlayer2].lines[line].bonus;
                console.log('-----');
            }
        }
        if (linesWonInSequence[keyPlayer1] === 3) {
            results[keyPlayer1].lines = results[keyPlayer1].lines.map(l => {
                l.line += 1;
                l.total += 1;
                return l;
            });
            results[keyPlayer2].lines = results[keyPlayer2].lines.map(l => {
                l.line -= 1;
                l.total -= 1;
                return l;
            });
        } else if (linesWonInSequence[keyPlayer2] === 3) {
            results[keyPlayer2].lines = results[keyPlayer2].lines.map(l => {
                l.line += 1;
                l.total += 1;
                return l;
            });
            results[keyPlayer1].lines = results[keyPlayer1].lines.map(l => {
                l.line -= 1;
                l.total -= 1;
                return l;
            });
        }
    });
    const totals = calculateTotals(results);
    return totals;
}

function lineWon(player1Results, player2Results, line) {
    return [
        player1Results.lines.map((l, i) => {
            if (i === line) {
                player1Results.lines[i].line +=1
            }
            return l;
        }),
        player2Results.lines.map((l, i) => {
            if (i === line) {
                player2Results.lines[i].line -=1
            }
            return l;
        }),
    ];
}

function lineBonuses(player1Line, player2Line, line) {
    const player1Bonus = player1Line
        ? bonusPoints[player1Line.combination](line, player1Line.value)
        : 0;
    const player2Bonus = player2Line
        ? bonusPoints[player2Line.combination](line, player2Line.value)
        : 0;
    const bonuses = [(player1Bonus - player2Bonus), (player2Bonus - player1Bonus)]
    return bonuses;
}

function calculateTotals(playerResults) {
    return Object.keys(playerResults).reduce((acc, key) => {
        const currResult = playerResults[key];
        currResult.total = currResult.lines.reduce((acc, line) => {
            acc += line.total;
            return acc;
        }, currResult.total);
        acc[key] = currResult;
        return acc;
    }, {});
}

/**
 * Handle request with array of users, which is array of lines
 * @param playersData
 */
function handleRequest(playersData) {
    return Object.keys(playersData)
        .reduce((acc, playerKey) => {
            acc[playerKey] = calculatePlayerLayout(playersData[playerKey]);
            return acc;
        }, {});
}

/**
 * Calculate data for player's array of lines
 * @param data
 */
function calculatePlayerLayout(data) {
    const playerLines = data.reduce((acc, line) => {
        acc.push(calculateLine(line));
        return acc;
    }, []);
    return {
        lines: playerLines,
        scoop: checkScoop(playerLines)
    };
}

/**
 * Calculate one line
 * @param line [ String ]
 */
function calculateLine(line) {
    const lineCalculated = line.reduce((acc, card) => {
        const parsedCard = parseCard(card);
        acc.values[parsedCard.value]++;
        acc.suits[parsedCard.suit]++;
        return acc;
    }, {
        values: [ ...cards.reduce((acc, c, i) => { acc[i] = 0; return acc; }, []) ],
        suits: [  ...suits.reduce((acc, s, i) => { acc[i] = 0; return acc; }, []) ]
    });

    const pairs = combinationChecker.pairs(lineCalculated);
    if (pairs) {
        return pairs;
    }
    if (line.length > 3) {
        const sequence = combinationChecker.sequence(lineCalculated);
        if (sequence) {
            return sequence;
        }
    }
    const kicker = Math.max(...lineCalculated.values.reduce((acc, item, index) => {
        if (item > 0) {
            acc.push(index);
        }
        return acc;
    }, []));
    return {
        combination: 0,
        value: kicker,
        label: `${cards[kicker]} high`
    };
}

/**
 * Transform card to number representation
 * @param card String
 * @return { value: number, suit: number }
 */
function parseCard(card) {
    const [ value, suit ] = card.split('');
    const [ valueIndex, suitIndex ] = [cards.indexOf(value), suits.indexOf(suit)];
    if (valueIndex === -1) {
        throw new Error(`No such card value: ${value}`);
    }
    if (suitIndex === -1) {
        throw new Error(`No such card suit: ${suit}`);
    }
    return { value: valueIndex, suit: suitIndex };
}

/**
 * Compare two lines
 * @param lineA
 * @param lineB
 * @return number 1 | 0 | -1
 */
function compareLines(lineA, lineB) {
    if (lineA.combination > lineB.combination) {
        return 1;
    }
    if (lineB.combination > lineA.combination) {
        return -1
    }
    if (lineA.value > lineB.value) {
        return 1;
    }
    if (lineB.value > lineA.value) {
        return -1;
    }
    return 0;
}

function checkScoop(lines) {
    return (compareLines(lines[0], lines[1]) + compareLines(lines[1], lines[2])) === 0;
}
