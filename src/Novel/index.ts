import axios from 'axios';

import { NovelState, Score } from '../type';

const voidScore: Score = [0, 0, 0, 0, 0];

class Novel {
    static readonly weight = [5, 4, 3, 2, 1];

    readonly id: number;
    protected state: NovelState;
    protected score = voidScore;
    protected callback = (state: NovelState) => {};

    constructor(id: number, callback?: (state: NovelState) => void) {
        this.id = id;
        this.state = 'padding';
        if (callback) {
            this.callback = callback;
        }
    }

    changeState = (state: NovelState) => {
        this.state = state;
        this.callback(state);
    };

    init = async () => {
        await this.getScoreById();
    };

    getScoreById = async (): Promise<void> => {
        try {
            const { data = '0,0,0,0,0' } = await axios.get(
                `http://zxcs.me/content/plugins/cgz_xinqing/cgz_xinqing_action.php?action=show&id=${this.id}`
            );

            if (typeof data !== 'string') {
                throw new Error('data must be string');
            }

            const [score5, score4, score3, score2, score1] = data.split(',');

            this.score = [+score5, +score4, +score3, +score2, +score1];
            this.changeState('ready');
        } catch {
            this.changeState('failed');
        }
    };

    getScore = () => {
        return this.score;
    };

    getState = () => {
        return this.state;
    };

    getParticipants = (): number => {
        return (
            this.score[0] +
            this.score[1] +
            this.score[2] +
            this.score[3] +
            this.score[4]
        );
    };

    getTotalScore = (): number => {
        return this.score.reduce((sum, item, index) => {
            return sum + item * Novel.weight[index];
        }, 0);
    };

    getAverageByScore = (): number => {
        const participants = this.getParticipants();
        if (!participants) {
            return 0;
        }
        const totalScore = this.getTotalScore();
        return totalScore / participants;
    };

    show = () => {
        console.log(
            this.id,
            '评分： ',
            this.getTotalScore(),
            this.getAverageByScore().toFixed(2),
            this.getParticipants(),
            `http://zxcs.me/post/${this.id}`
        );
    };

    //排序用函数
    static sortByAverage = (novel1: Novel, novel2: Novel): number => {
        return novel2.getAverageByScore() - novel1.getAverageByScore();
    };

    static sortByTotalScore = (novel1: Novel, novel2: Novel): number => {
        return novel2.getTotalScore() - novel1.getTotalScore();
    };
}

export default Novel;
