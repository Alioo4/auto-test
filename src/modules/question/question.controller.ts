import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Public, Roles } from '../auth/guards';
import { GetQuestionsQueryDto } from './dto';

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Create a new question' })
    create(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionService.create(createQuestionDto);
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all questions (with optional search and pagination)' })
    findAll() {
        return this.questionService.findAll();
    }

    @Get('get-questions-for-admin')
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Get all questions for admin with pagination' })
    findAllForAdmin(@Query() query: GetQuestionsQueryDto) {
        return this.questionService.findAllForAdmin(query);
    }

    @Public()
    @Get('get-count-questions')
    @ApiOperation({ summary: 'Get the count of all questions' })
    getCountQuestions() {
        return this.questionService.countAllQuestions();
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get one question by ID' })
    @ApiParam({ name: 'id', type: Number })
    findOne(@Param('id') id: string) {
        return this.questionService.findOne(+id);
    }

    @Patch(':id')
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Update a question by ID' })
    @ApiParam({ name: 'id', type: Number })
    update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
        return this.questionService.update(+id, updateQuestionDto);
    }

    @Delete(':id')
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Delete a question by ID' })
    @ApiParam({ name: 'id', type: Number })
    remove(@Param('id') id: string) {
        return this.questionService.remove(+id);
    }
}
