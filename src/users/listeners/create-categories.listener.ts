import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { UserCreatedEvent } from '../events/user-created.event';
import { CategoryFacade } from 'src/categories/facades/category.facade';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';

@Injectable()
export class CreateCategoriesListener {
  constructor(private readonly categoryFacade: CategoryFacade) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    const defaultCategories : CreateCategoryDto[] = [
      { name: 'Alimentação', description: 'Despesas com alimentação', icon: 'basket', color: '#FF5733', userId: event.userId },
      { name: 'Assinatura', description: 'Pagamentos recorrentes de assinaturas', icon: 'tag', color: '#2E86C1', userId: event.userId },
      { name: 'Casa', description: 'Gastos relacionados à casa', icon: 'home', color: '#AF7AC5', userId: event.userId },
      { name: 'Energia', description: 'Despesas com energia elétrica', icon: 'bolt', color: '#F4D03F', userId: event.userId },
      { name: 'Internet', description: 'Gastos com serviços de internet', icon: 'wifi', color: '#1ABC9C', userId: event.userId },
      { name: 'Compras', description: 'Compras gerais', icon: 'shopping-bag', color: '#8E44AD', userId: event.userId },
      { name: 'Educação', description: 'Despesas com educação', icon: 'graduation', color: '#3498DB', userId: event.userId },
      { name: 'Eletrônicos', description: 'Gastos com eletrônicos e tecnologia', icon: 'monitor', color: '#E74C3C', userId: event.userId },
      { name: 'Jogos', description: 'Gastos com jogos e entretenimento digital', icon: 'gaming', color: '#F39C12', userId: event.userId },
      { name: 'Lazer', description: 'Despesas com lazer e hobbies', icon: 'trophy', color: '#1E8449', userId: event.userId },
      { name: 'Operação bancária', description: 'Taxas e despesas bancárias', icon: 'briefcase', color: '#2C3E50', userId: event.userId },
      { name: 'Outros', description: 'Gastos diversos não categorizados', icon: 'tags', color: '#BDC3C7', userId: event.userId },
      { name: 'Pix', description: 'Transferências via Pix', icon: 'wallet', color: '#2980B9', userId: event.userId },
      { name: 'Presentes', description: 'Despesas com presentes', icon: 'gift', color: '#F1948A', userId: event.userId },
      { name: 'Saúde', description: 'Despesas com saúde', icon: 'medical', color: '#E74C3C', userId: event.userId },
      { name: 'Serviços', description: 'Gastos com serviços variados', icon: 'cart', color: '#7D3C98', userId: event.userId },
      { name: 'Streaming', description: 'Assinaturas de streaming', icon: 'photo-group', color: '#8E44AD', userId: event.userId },
      { name: 'Supermercado', description: 'Compras de supermercado', icon: 'store', color: '#D35400', userId: event.userId },
      { name: 'Transporte', description: 'Despesas com transporte', icon: 'car', color: '#5D6D7E', userId: event.userId },
      { name: 'Vestuário', description: 'Gastos com roupas e acessórios', icon: 'tag', color: '#C0392B', userId: event.userId },
      { name: 'Viagem', description: 'Despesas relacionadas a viagens', icon: 'airplane', color: '#3498DB', userId: event.userId },
    ];

    for (const category of defaultCategories) {
      await this.categoryFacade.createCategory(category);
    }
  }
}
