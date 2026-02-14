import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TechniciansService {
  constructor(private prisma: PrismaService) {}

  async findAll(options?: {
    city?: string;
    specialization?: string;
    status?: string;
    limit?: number;
    page?: number;
  }) {
    const {
      city,
      specialization,
      status = 'ACTIVE',
      limit = 50,
      page = 1,
    } = options || {};

    const where: any = {};
    if (status) where.status = status;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (specialization) {
      where.specializations = { has: specialization };
    }

    const [data, total] = await Promise.all([
      this.prisma.technician.findMany({
        where,
        orderBy: { rating: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.technician.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const technician = await this.prisma.technician.findUnique({
      where: { id },
    });

    if (!technician) {
      throw new NotFoundException('Technician not found');
    }

    return technician;
  }

  async create(data: {
    name: string;
    phone?: string;
    email?: string;
    city?: string;
    specializations?: string[];
    rating?: number;
    isAvailable?: boolean;
    description?: string;
    logoUrl?: string;
    website?: string;
    workingHours?: string;
  }) {
    return this.prisma.technician.create({ data });
  }

  async update(id: string, data: any) {
    const technician = await this.prisma.technician.findUnique({
      where: { id },
    });

    if (!technician) {
      throw new NotFoundException('Technician not found');
    }

    return this.prisma.technician.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const technician = await this.prisma.technician.findUnique({
      where: { id },
    });

    if (!technician) {
      throw new NotFoundException('Technician not found');
    }

    return this.prisma.technician.delete({
      where: { id },
    });
  }

  async getSpecializations() {
    const technicians = await this.prisma.technician.findMany({
      select: { specializations: true },
    });

    const allSpecs = new Set<string>();
    technicians.forEach((t) => {
      t.specializations.forEach((s) => allSpecs.add(s));
    });

    return Array.from(allSpecs);
  }

  async getCities() {
    const technicians = await this.prisma.technician.findMany({
      select: { city: true },
      distinct: ['city'],
      where: { city: { not: null } },
    });

    return technicians.map((t) => t.city).filter(Boolean);
  }
}
