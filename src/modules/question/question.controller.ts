import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new question' })
    create(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionService.create(createQuestionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all questions (with optional search and pagination)' })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findAll(
        @Query('search') search?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number
    ) {
        return this.questionService.findAll({ search, page, limit });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get one question by ID' })
    @ApiParam({ name: 'id', type: Number })
    findOne(@Param('id') id: string) {
        return this.questionService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a question by ID' })
    @ApiParam({ name: 'id', type: Number })
    update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
        return this.questionService.update(+id, updateQuestionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a question by ID' })
    @ApiParam({ name: 'id', type: Number })
    remove(@Param('id') id: string) {
        return this.questionService.remove(+id);
    }
}
