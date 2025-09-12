import { NextRequest, NextResponse } from "next/server";
import prisma from "@downzoo/db";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

		if (!id) {
			return NextResponse.json(
				{ success: false, message: "文档ID不能为空" },
				{ status: 400 }
			);
		}

		// 从数据库获取文档
		const doc = await prisma.doc.findUnique({
			where: { id },
			select: {
				id: true,
				title: true,
				content: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!doc) {
			return NextResponse.json(
				{ success: false, message: "文档不存在" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: doc,
		});
	} catch (error) {
		console.error("获取文档失败:", error);
		return NextResponse.json(
			{
				success: false,
				message: "服务器内部错误",
				error: process.env.NODE_ENV === "development" ? error : undefined,
			},
			{ status: 500 }
		);
	}
}
