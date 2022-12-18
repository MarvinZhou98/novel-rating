import { program } from 'commander';
import rating from './rating';

program
    .requiredOption('--type <string>')
    .option('--id <numbers...>')
    .option('--start <number>')
    .option('--end <number>');

program.parse();

const { type, id, start, end } = program.opts();

switch (type) {
    case 'rating':
        rating(id, start, end);
        break;
    default:
        throw new Error('参数 --type 的值无效');
}
