import Novel from './Novel';
import { stdout } from 'single-line-log';

const rating = async (
    param_id?: string[],
    param_start?: string,
    param_end?: string
) => {
    const ids = (param_id || []).map((item) => +item);
    const start = param_start ? +param_start : 0;
    const end = param_end ? +param_end : 0;

    const novels: Novel[] = [];

    let count = 0;
    const total = end - start + ids.length;

    const reduceNovel = async (id: number) => {
        const newNovel = new Novel(id);
        await newNovel.init();
        novels.push(newNovel);

        stdout(`当前进度为： ${++count} / ${total}`);
    };

    for (let id = start; id < end; id++) {
        await reduceNovel(id);
    }
    for (let id of ids) {
        await reduceNovel(id);
    }

    novels.sort(Novel.sortByTotalScore);
    novels
        .filter((item) => item.getParticipants() > 500)
        .forEach((item) => item.show());
};

export default rating;
